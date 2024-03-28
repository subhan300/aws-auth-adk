import { 
    CognitoIdentityProviderClient,
     InitiateAuthCommand, 
     RespondToAuthChallengeCommand,
     AdminCreateUserCommand,
     SignUpCommand,
    } from "@aws-sdk/client-cognito-identity-provider";

// Initialize CognitoIdentityProviderClient
const clientId = process.env.CLIENT_ID;
const userPoolId = process.env.USER_POOL_ID;
const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.REGION});


async function initiateAuth(username, password) {
    try {
        const response = await cognitoClient.send(new InitiateAuthCommand({
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: clientId,
            AuthParameters: {
                USERNAME: username,
                PASSWORD: password
            }
        }));
        return response;
    } catch (error) {
        console.error("Error initiating authentication:", error);
        throw error;
    }
}
async function respondToAuthChallenge(Session, ChallengeResponses) {
    try {
        const response = await cognitoClient.send(new RespondToAuthChallengeCommand({
            ChallengeName: "NEW_PASSWORD_REQUIRED", // Change according to the challenge type
            ClientId: clientId,
            ChallengeResponses,  
            Session   
        }));

        return response;
    } catch (error) {
        console.error("Error responding to authentication challenge:", error);
        throw error;
    }
}




async function createUser(username, password, email) {
    console.log("pass",password,email)
    try {
        // Call the SignUp API to create a new user
        // const command = new AdminCreateUserCommand({
        //     ClientId:clientId, // Replace with your Cognito User Pool client ID
        //     UserPoolId: userPoolId,
        //     Username: username,
        //     TemporaryPassword: password,
        //     UserAttributes: [{ Name: "name", Value: 'subhan123', },{ Name: "address", Value: 'subhan123', }],
        //     ValidationData: [
        //         {
        //           Name: "phone", // required
        //           Value: "+923362039061",
        //         },
        //       ],
        //     DesiredDeliveryMediums: ["SMS"], // Specify the delivery medium for sending invitation messages to new users
        //     // MessageAction: "SUPPRESS", // Specify whether to send an invitation message to the new user
        //     ForceAliasCreation: true || false,
        // });
        const command = new SignUpCommand({
            ClientId:clientId, // Replace with your Cognito User Pool client ID
            UserPoolId: userPoolId,
            Username: username,
            Password: password,
            // UserAttributes: [{ Name: "name", Value: 'subhan123', },{ Name: "phone", Value: '+923362039061' },{ Name: "address", Value: 'subhan123', }],
            // DesiredDeliveryMediums: ["SNS"], // Specify the delivery medium for sending invitation messages to new users
            // MessageAction: "SUPPRESS", // Specify whether to send an invitation message to the new user
        });
        const response = await cognitoClient.send(command);
        return response; // Return the response if needed
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
}
async function passwordReset(username,password) {
    try {
        const authResult = await initiateAuth(username,password); // Provide a dummy password for initiating password reset
        // Here, you may want to handle the challenge, but in this example, we'll assume it's handled externally
        console.log('Password reset initiated. Challenge response needed:', authResult);
        return authResult;
    } catch (error) {
        console.error('Password reset initiation failed:', error);
        throw error;
    }
}

// Function to set new password after password reset
async function newPassword(session, params) {
    // const {password}
    console.log(typeof session,"new password session");
    try {
        const authResult = await respondToAuthChallenge(session, params);
        console.log('New password set successfully!');
        return authResult;
    } catch (error) {
        console.error('Setting new password failed:', error);
        throw error;
    }
}
export {
    initiateAuth,
    respondToAuthChallenge,
    passwordReset,
    newPassword,
    createUser,
};