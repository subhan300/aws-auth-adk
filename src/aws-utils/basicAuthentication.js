import { 
    CognitoIdentityProviderClient,
     InitiateAuthCommand, 
     RespondToAuthChallengeCommand,
     AdminCreateUserCommand,
    } from "@aws-sdk/client-cognito-identity-provider";

// Initialize CognitoIdentityProviderClient
const clientId = process.env.CLIENT_ID;
const userPoolId = process.env.USER_POOL_ID;
const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.REGION});

// Initialize function to configure SDK
async function initializeCognito() {
    // You can add any additional configuration here
}

// Function to initiate authentication
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
// Function to respond to authentication challenge
async function respondToAuthChallenge(session, challengeResponses) {
    try {
        const response = await cognitoClient.send(new RespondToAuthChallengeCommand({
            ChallengeName: "NEW_PASSWORD_REQUIRED", // Change according to the challenge type
            ClientId: "51uf6q4h1llc4n80hsle6lhqpk",
            ChallengeResponses: {
                USERNAME:"hasnainaskari32@gmail.com",
                NEW_PASSWORD: challengeResponses.newPassword,
                 
            },  
            Session:session   
        }));

        return response;
    } catch (error) {
        console.error("Error responding to authentication challenge:", error);
        throw error;
    }
}


async function initiateAndRespondToAuth(username, password, newPassword) {
    try {
        // Initiate authentication
        const authResult = await initiateAuth(username, password);

        // Handle authentication challenge if necessary
        if (authResult.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
            const session = {
                username: username,
                secretHash:"/TJzL+NqFoqJYYMQy0iCY8T/SvHxGlT9nGKccw11yEYQ=",
                // Add other session parameters if needed
            };
            const challengeResponses = {
                newPassword: newPassword,
                // Add other challenge responses if needed
            };
            const newAuthResult = await respondToAuthChallenge(session, challengeResponses);
            console.log('New authentication result:', newAuthResult);
            return newAuthResult;
        } else {
            // Authentication successful without any challenge
            console.log('Authentication successful:', authResult);
            return authResult;
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


async function createUser(username, password, email) {
    try {
        // Call the SignUp API to create a new user
        const command = new AdminCreateUserCommand({
            ClientId:clientId, // Replace with your Cognito User Pool client ID
            UserPoolId: userPoolId,
            Username: username,
            TemporaryPassword: password,
            UserAttributes: [
                { Name: "email", Value: email },
            ],
            DesiredDeliveryMediums: ["EMAIL"], // Specify the delivery medium for sending invitation messages to new users
            MessageAction: "SUPPRESS", // Specify whether to send an invitation message to the new user
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
async function newPassword(session, newPassword) {
    console.log(typeof session,"new password session");
    try {
        const authResult = await respondToAuthChallenge(session, { newPassword });
        console.log('New password set successfully!');
        // Here, you can store the tokens in localStorage or sessionStorage for future use
        return authResult;
    } catch (error) {
        console.error('Setting new password failed:', error);
        throw error;
    }
}
export {
    initializeCognito,
    initiateAuth,
    respondToAuthChallenge,
    passwordReset,
    newPassword,
    createUser,
};