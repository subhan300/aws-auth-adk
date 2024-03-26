import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { calculateSRP_A, passwordClaimSignature } from "./mfaCalculateFucntions";

const clientId = process.env.CLIENT_ID;
const userPoolId = process.env.USER_POOL_ID;
const client = new CognitoIdentityProviderClient({ region: process.env.REGION});


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





export async function signIn(username, password) {
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
const adminRespondToAuthChallenge = async (authObj,password) => {
    const { ChallengeName } = authObj;
    const { USERNAME, SECRET_BLOCK, SRP_B ,SALT} = authObj.ChallengeParameters;
    const srpSalt = SALT; 
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
