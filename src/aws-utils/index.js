import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
  AdminInitiateAuthCommand
} from "@aws-sdk/client-cognito-identity-provider";
import {
  AdminRespondToAuthChallengeCommand,
  ChallengeNameType,
} from "@aws-sdk/client-cognito-identity-provider";
import dayjs from "dayjs";
import { calculateSRP_A, passwordClaimSignature, passwordVerifierConfig } from "./calculateFucntions";

function generateRandomHexPassword(length) {
  const charset = "0123456789abcdefABCDEF";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

// Function to authenticate user and handle Multi-Factor Authentication (MFA)
const clientId = "51uf6q4h1llc4n80hsle6lhqpk";
const userPoolId = "ap-south-1_iUi5jchz5";
const client = new CognitoIdentityProviderClient({ region: "ap-south-1" });


// Function to respond to Multi-Factor Authentication (MFA) challenge
async function respondToMFAChallenge(session, mfaCode, clientId, userPoolId) {
  const client = new CognitoIdentityProviderClient({ region: "us-west-2" });

  const respondToAuthChallengeCommand = new RespondToAuthChallengeCommand({
    ChallengeName: "SMS_MFA",
    ClientId: clientId,
    ChallengeResponses: {
      USERNAME: session.username,
      SMS_MFA_CODE: mfaCode,
    },
    Session: session.session,
  });

  try {
    const response = await client.send(respondToAuthChallengeCommand);
    return response;
  } catch (error) {
    console.error("Error responding to MFA challenge:", error);
    throw error;
  }
}

// Function to confirm Multi-Factor Authentication (MFA)
async function confirmMFA(session, mfaCode, clientId, userPoolId) {
  const client = new CognitoIdentityProviderClient({ region: "ap-south-1" });

  const respondToAuthChallengeCommand = new RespondToAuthChallengeCommand({
    ChallengeName: "SOFTWARE_TOKEN_MFA",
    ClientId: clientId,
    ChallengeResponses: {
      USERNAME: session.username,
      SOFTWARE_TOKEN_MFA_CODE: mfaCode,
    },
    Session: session.session,
  });

  try {
    const response = await client.send(respondToAuthChallengeCommand);
    return response;
  } catch (error) {
    console.error("Error confirming MFA:", error);
    throw error;
  }
}

const username = "username";
const password = "password";
const mfaCode = "123456";

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/** snippet-start:[javascript.v3.cognito-idp.actions.AdminRespondToAuthChallenge] */

export function getCurrentTimestamp() {
    const timestamp = dayjs()
    console.log(timestamp.format('ddd MMM D HH:mm:ss [UTC] YYYY'))
    return timestamp.format('ddd MMM D HH:mm:ss [UTC] YYYY');
}


export async function signIn(username, password) {
  // debugger

  const {SRP_A}=await calculateSRP_A(userPoolId)
  console.log("calculateSRP_A(userPoolId)",SRP_A)
  const initiateAuthCommand = new InitiateAuthCommand({
    // AuthFlow: 'USER_PASSWORD_AUTH',
    AuthFlow: "USER_SRP_AUTH",
    ClientId: clientId,
    UserPoolId: userPoolId,
    AuthParameters: {
      USERNAME: username,     
      SRP_A

    },
  });

  try {
    const authResponse = await client.send(initiateAuthCommand);
    console.log("auth response===", authResponse);
   
    return authResponse;

  } catch (error) {
    console.error("Error authenticating with:", error);
    throw error;
  }
}
const adminRespondToAuthChallenge = async (authObj) => {
    const { ChallengeName } = authObj;
    const { USERNAME, SECRET_BLOCK, SRP_B ,SALT} = authObj.ChallengeParameters;
    


    const password = "samsungj300";
    const timestamp = getCurrentTimestamp();
    const srpSalt = SALT; // You may need to obtain this from your challenge parameters

    // Calculate PASSWORD_CLAIM_SIGNATURE using passwordClaimSignature function
    const {signature,dateNow}=await  passwordClaimSignature(USERNAME,password,SRP_B, srpSalt,SECRET_BLOCK);

    console.log('passwordClaimSignatureValue',signature)

    const client = new CognitoIdentityProviderClient({ region: "ap-south-1" });
    const command = new RespondToAuthChallengeCommand({
        ChallengeName,
        ChallengeResponses: {
            USERNAME,
            CHALLENGE_NAME: ChallengeName,
            PASSWORD_CLAIM_SIGNATURE: signature ,
            PASSWORD_CLAIM_SECRET_BLOCK:SECRET_BLOCK,
            TIMESTAMP: dateNow
        },
        ClientId: clientId,
        UserPoolId: userPoolId,
    });

    try {
        const response = await client.send(command);
        return response;
    } catch (error) {
        console.error("Error responding to auth challenge:", error);
        throw error;
    }
};

export { adminRespondToAuthChallenge };

// authenticateWithMFA(username, password, mfaCode, clientId, userPoolId)
//     .then((authResult) => {
//         console.log('Authentication with MFA successful:', authResult);
//     })
//     .catch((error) => {
//         console.error('Error authenticating with MFA:', error);
//     });
// const adminRespondToAuthChallenge = (authObj) => {
//     const {ChallengeName}=authObj
//     const {USERNAME,SECRET_BLOCK,SRP_B}=authObj.ChallengeParameters
//   const client = new CognitoIdentityProviderClient({ region: "us-west-2" });
//   const command = new RespondToAuthChallengeCommand({
//     ChallengeName,
//     ChallengeResponses: {
//       // SOFTWARE_TOKEN_MFA_CODE: totp,
//       USERNAME,
//       CHALLENGE_NAME: ChallengeName,
//       PASSWORD_CLAIM_SIGNATURE:SRP_B,
//       PASSWORD_CLAIM_SECRET_BLOCK: SECRET_BLOCK,
//       'TIMESTAMP': getCurrentTimestamp()
//     },
//     ClientId: clientId,
//     UserPoolId: userPoolId,
//     // Session: session,
//   });
//   console.log("comman ",command)
//   return client.send(command);
// };