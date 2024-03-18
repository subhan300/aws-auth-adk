import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { createHmac } from "crypto" 
import {
  AdminRespondToAuthChallengeCommand,
  ChallengeNameType,
} from "@aws-sdk/client-cognito-identity-provider";
import dayjs from "dayjs";
import { passwordClaimSignature, passwordVerifierConfig } from "./calculateFucntions";

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
const userPoolId = "51uf6q4h1llc4n80hsle6lhqpk";
const client = new CognitoIdentityProviderClient({ region: "ap-south-1" });
export async function signIn(username, password) {
  // debugger
  const initiateAuthCommand = new InitiateAuthCommand({
    // AuthFlow: 'USER_PASSWORD_AUTH',
    AuthFlow: "USER_SRP_AUTH",
    ClientId: clientId,
    AuthParameters: {
      USERNAME: username,
      // 'EMAIL':'subhan.akram2400@gmail.com',
      SRP_A: generateRandomHexPassword(32),
    //   PASSWORD: "samsungj300",
    },
  });

  try {
    const authResponse = await client.send(initiateAuthCommand);
    console.log("auth response===", authResponse);
   
    return authResponse;
    // // Step 2: Respond to MFA challenge
    // const respondToMFAResponse = await respondToMFAChallenge(session, mfaCode, clientId, userPoolId);

    // // Step 3: Confirm MFA
    // const confirmMFAResponse = await confirmMFA(session, mfaCode, clientId, userPoolId);

    // // Return authentication result
    // return confirmMFAResponse.AuthenticationResult;
  } catch (error) {
    console.error("Error authenticating with MFA:", error);
    throw error;
  }
}

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
  const client = new CognitoIdentityProviderClient({ region: "us-west-2" });

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

const adminRespondToAuthChallenge = async (authObj) => {
    const { ChallengeName } = authObj;
    const { USERNAME, SECRET_BLOCK, SRP_B ,SALT} = authObj.ChallengeParameters;
    

    // Generate required parameters
    const deviceKey = "device123";
    const deviceGroupKey = "group1";
    const devicePassword = "password123";
    const timestamp = getCurrentTimestamp();
    const srpSalt = SALT; // You may need to obtain this from your challenge parameters

    // Calculate PASSWORD_CLAIM_SIGNATURE using passwordClaimSignature function
    const passwordClaimSignatureValue =await  passwordClaimSignature(SRP_B, srpSalt, timestamp, SECRET_BLOCK,deviceKey,deviceGroupKey,devicePassword);

    // Generate PASSWORD_CLAIM_SECRET_BLOCK and PASSWORD_CLAIM_SIGNATURE
    // const { devicePassword: PASSWORD_CLAIM_SECRET_BLOCK, passwordVerifier: PASSWORD_CLAIM_SIGNATURE } =await passwordVerifierConfig(deviceKey, deviceGroupKey);
    // console.log('passwordClaimSignatureValue',passwordClaimSignatureValue,'---',PASSWORD_CLAIM_SECRET_BLOCK)
    // Send the request to respond to the authentication challenge
    const client = new CognitoIdentityProviderClient({ region: "us-west-2" });
    const command = new RespondToAuthChallengeCommand({
        ChallengeName,
        ChallengeResponses: {
            USERNAME,
            CHALLENGE_NAME: ChallengeName,
            PASSWORD_CLAIM_SIGNATURE: 'TJzL+NqFoqJYYMQy0iCY8T/SvHxGlT9nGKccw11yEYQ=' ,
            // PASSWORD_CLAIM_SECRET_BLOCK:"TJzL+NqFoqJYYMQy0iCY8T/SvHxGlT9nGKccw11yEYQ=",
            TIMESTAMP: timestamp
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
