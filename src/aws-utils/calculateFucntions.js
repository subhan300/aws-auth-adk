// // import sha256 from 'crypto-js/sha256';
// // import hmacSHA512 from 'crypto-js/hmac-sha512';
// // // crypto-js/sha1
// // import Base64 from 'crypto-js/enc-base64';

// // // const HEX_N =
// // //     "FFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74020BBEA63B139B22514A08798E3404DDEF9519B3CD3A" +
// // //     "431B302B0A6DF25F14374FE1356D6D51C245E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7EDEE386BFB5A899FA5" +
// // //     "AE9F24117C4B1FE649286651ECE45B3DC2007CB8A163BF0598DA48361C55D39A69163FA8FD24CF5F83655D23DCA3AD961C62" +
// // //     "F356208552BB9ED529077096966D670C354E4ABC9804F1746C08CA18217C32905E462E36CE3BE39E772C180E86039B2783A2" +
// // //     "EC07A28FB5C55DF06F4C52C9DE2BCBF6955817183995497CEA956AE515D2261898FA051015728E5A8AAAC42DAD33170D0450" +
// // //     "7A33A85521ABDF1CBA64ECFB850458DBEF0A8AEA71575D060C7DB3970F85A6E1E4C7ABF5AE8CDB0933D71E8C94E04A25619D" +
// // //     "CEE3D2261AD2EE6BF12FFA06D98A0864D87602733EC86A64521F2B18177B200CBBE117577A615D6C770988C0BAD946E208E2" +
// // //     "4FA074E5AB3143DB5BFCE0FD108E4B82D120A93AD2CAFFFFFFFFFFFFFFFF";
// // // const HEX_G = "2";
// // // const SECURE_RANDOM = crypto.createHash('sha1').update('sha1prng').digest();

// // const DERIVED_KEY_INFO = "Caldera Derived Key";
// // const DERIVED_KEY_SIZE = 16;
// // const HEX_N =
// //     "FFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74020BBEA63B139B22514A08798E3404DDEF9519B3CD3A" +
// //     "431B302B0A6DF25F14374FE1356D6D51C245E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7EDEE386BFB5A899FA5" +
// //     "AE9F24117C4B1FE649286651ECE45B3DC2007CB8A163BF0598DA48361C55D39A69163FA8FD24CF5F83655D23DCA3AD961C62" +
// //     "F356208552BB9ED529077096966D670C354E4ABC9804F1746C08CA18217C32905E462E36CE3BE39E772C180E86039B2783A2" +
// //     "EC07A28FB5C55DF06F4C52C9DE2BCBF6955817183995497CEA956AE515D2261898FA051015728E5A8AAAC42DAD33170D0450" +
// //     "7A33A85521ABDF1CBA64ECFB850458DBEF0A8AEA71575D060C7DB3970F85A6E1E4C7ABF5AE8CDB0933D71E8C94E04A25619D" +
// //     "CEE3D2261AD2EE6BF12FFA06D98A0864D87602733EC86A64521F2B18177B200CBBE117577A615D6C770988C0BAD946E208E2" +
// //     "4FA074E5AB3143DB5BFCE0FD108E4B82D120A93AD2CAFFFFFFFFFFFFFFFF";
// // const HEX_G = "2";

// // function generateRandomBigInteger() {
// //     let randomBytes = new Uint8Array(256 / 8); // 256 bits = 32 bytes
// //     window.crypto.getRandomValues(randomBytes);
// //     let hexString = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
// //     return BigInt('0x' + hexString);
// // }

// // async function calculateK() {
// //     let NBytes = new TextEncoder().encode(HEX_N);
// //     let gBytes = new TextEncoder().encode(HEX_G);
// //     let hash = await window.crypto.subtle.digest('SHA-256', Buffer.concat([NBytes, gBytes]));
// //     let hashHex = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
// //     return BigInt('0x' + hashHex);
// // }

// // async function hash(...inputs) {
// //     const data = inputs.map(input => new TextEncoder().encode(input));
// //     const buffer = await crypto.subtle.digest('SHA-256', Buffer.concat(data));
// //     return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
// // }

// // async function hmac(key, ...inputs) {
// //     const keyBuffer = new TextEncoder().encode(key);
// //     const keyCryptoKey = await window.crypto.subtle.importKey('raw', keyBuffer, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
// //     const data = inputs.map(input => new TextEncoder().encode(input));
// //     const buffer = await crypto.subtle.sign('HMAC', keyCryptoKey, Buffer.concat(data));
// //     return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
// // }
// // export function passwordClaimSignature(srpB, srpSalt, timestamp, secretBlock) {
// //     let N = BigInt('0x' + HEX_N);
// //     let g = BigInt('0x' + HEX_G);
// //     let k = calculateK();

// //     let fullPassword = hash(deviceGroupKey, deviceKey, ":", devicePassword);

// //     let B = BigInt('0x' + srpB);
// //     let salt = BigInt('0x' + srpSalt);

// //     if (B % N === BigInt(0))
// //         throw new Error("Bad server B");

// //     let A = generateRandomBigInteger();
// //     let u = hash(A.toString(16), B.toString(16));
// //     if (u % N === BigInt(0))
// //         throw new Error("Hash of A and B cannot be zero");

// //     let x = hash(salt.toString(16), fullPassword);

// //     let S = (B - k * (g ** x % N)) ** (A + u * x) % N;
// //     let prk = hmac(u.toString(16), S.toString(16));
// //     let hkdf = hmac(prk, DERIVED_KEY_INFO + String.fromCharCode(1)).slice(0, DERIVED_KEY_SIZE);

// //     let signature = hmac(
// //         hkdf,
// //         deviceGroupKey,
// //         deviceKey,
// //         Buffer.from(secretBlock, 'base64'),
// //         timestamp
// //     );

// //     return signature.toString('base64');
// // }

// // function srpa(deviceKey, deviceGroupKey) {
// //     let N = BigInt('0x' + HEX_N);
// //     let g = BigInt('0x' + HEX_G);

// //     let A = generateRandomBigInteger();
// //     return (g ** A % N).toString(16);
// // }
// // async function generateRandomBytes(length) {
// //     const randomBytes = new Uint8Array(length);
// //     window.crypto.getRandomValues(randomBytes);
// //     return btoa(String.fromCharCode.apply(null, randomBytes));
// // }

// // async function generateRandomBase64String(length) {
// //     const randomBytes = await generateRandomBytes(length);
// //     return randomBytes.slice(0, length);
// // }

// // export async function passwordVerifierConfig(deviceKey, deviceGroupKey) {
// //     let N = BigInt('0x' + HEX_N);
// //     let g = BigInt('0x' + HEX_G);

// //     const randomPassword = await generateRandomBase64String(40);
// //     // let randomPassword = crypto.randomBytes(40).toString('base64');
// //     let fullPassword = hash(deviceGroupKey, deviceKey, ":", randomPassword);
// //     const salt = await generateRandomBase64String(16);
// //     // let salt = crypto.randomBytes(16).toString('base64');

// //     let x = hash(salt, fullPassword);
// //     let verifier = (g ** x % N).toString(16);

// //     return {
// //         devicePassword: randomPassword,
// //         passwordVerifier: verifier,
// //         salt: salt
// //     };
// // }

// // // Example usage
// // const deviceKey = "your_device_key";
// // const deviceGroupKey = "your_device_group_key";
// // const devicePassword = "your_device_password";
// // const srpB = "server_srpB";
// // const srpSalt = "server_srpSalt";
// // const timestamp = "current_timestamp";
// // const secretBlock = "base64_encoded_secret_block";

// // console.log(passwordClaimSignature(deviceKey, deviceGroupKey, devicePassword, srpB, srpSalt, timestamp, secretBlock));
// // console.log(srpa(deviceKey, deviceGroupKey));
// // console.log(passwordVerifierConfig(deviceKey, deviceGroupKey));

// // export async function passwordClaimSignature(srpB, srpSalt, timestamp, secretBlock, deviceGroupKey, deviceKey, devicePassword) {
// //     const N = BigInt('0x' + HEX_N);
// //     const g = BigInt('0x' + HEX_G);
// //     const k = await calculateK();

// //     const fullPassword = await hash(deviceGroupKey, deviceKey, ":", devicePassword);

// //     const B = BigInt('0x' + srpB);
// //     const salt = BigInt('0x' + srpSalt);

// //     if (B % N === BigInt(0))
// //         throw new Error("Bad server B");

// //     const A = await generateRandomBigInteger();
// //     const u = await hash(A.toString(16), B.toString(16));
// //     if (u % N === BigInt(0))
// //         throw new Error("Hash of A and B cannot be zero");

// //     const x = await hash(salt.toString(16), fullPassword);

// //     const S = modularExponentiation(B - k * (modularExponentiation(g, x, N) % N), A + u * x, N);
// //     const prk = await hmac(u.toString(16), S.toString(16));
// //     const hkdf = await hmac(prk, DERIVED_KEY_INFO + String.fromCharCode(1)).slice(0, DERIVED_KEY_SIZE);

// //     const signature = await hmac(
// //         hkdf,
// //         deviceGroupKey,
// //         deviceKey,
// //         new TextEncoder().encode(secretBlock),
// //         new TextEncoder().encode(timestamp)
// //     );

// //     return btoa(String.fromCharCode.apply(null, new Uint8Array(signature)));
// // }

// // async function modularExponentiation(base, exponent, modulus) {
// //     let result = 1n;
// //     base = base % modulus;
// //     while (exponent > 0n) {
// //         if (exponent % 2n === 1n) {
// //             result = (result * base) % modulus;
// //         }
// //         exponent = exponent >> 1n;
// //         base = (base * base) % modulus;
// //     }
// //     return result;
// // }

// // export async function passwordVerifierConfig(deviceGroupKey, deviceKey) {
// //     const N = BigInt('0x' + HEX_N);
// //     const g = BigInt('0x' + HEX_G);

// //     const randomPassword = await generateRandomBase64String(40);
// //     const fullPassword = await hash(deviceGroupKey, deviceKey, ":", randomPassword);

// //     const salt = await generateRandomBase64String(16);
// //     const x = await hash(salt.toString(), fullPassword);
// //     const verifier = modularExponentiation(g, x, N).toString(16);

// //     return {
// //         devicePassword: randomPassword,
// //         passwordVerifier: verifier,
// //         salt: salt
// //     };
// // }

// const HEX_N =
//     "FFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74020BBEA63B139B22514A08798E3404DDEF9519B3CD3A" +
//     "431B302B0A6DF25F14374FE1356D6D51C245E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7EDEE386BFB5A899FA5" +
//     "AE9F24117C4B1FE649286651ECE45B3DC2007CB8A163BF0598DA48361C55D39A69163FA8FD24CF5F83655D23DCA3AD961C62" +
//     "F356208552BB9ED529077096966D670C354E4ABC9804F1746C08CA18217C32905E462E36CE3BE39E772C180E86039B2783A2" +
//     "EC07A28FB5C55DF06F4C52C9DE2BCBF6955817183995497CEA956AE515D2261898FA051015728E5A8AAAC42DAD33170D0450" +
//     "7A33A85521ABDF1CBA64ECFB850458DBEF0A8AEA71575D060C7DB3970F85A6E1E4C7ABF5AE8CDB0933D71E8C94E04A25619D" +
//     "CEE3D2261AD2EE6BF12FFA06D98A0864D87602733EC86A64521F2B18177B200CBBE117577A615D6C770988C0BAD946E208E2" +
//     "4FA074E5AB3143DB5BFCE0FD108E4B82D120A93AD2CAFFFFFFFFFFFFFFFF";
// const HEX_G = "2";
// const DERIVED_KEY_INFO = "Caldera Derived Key";
// const DERIVED_KEY_SIZE = 16;

// async function calculateK() {
//     const encoder = new TextEncoder();
//     const NBytes = encoder.encode(HEX_N);
//     const gBytes = encoder.encode(HEX_G);
//     const hashBuffer = await crypto.subtle.digest('SHA-256', concatUint8Arrays(NBytes, gBytes));
//     const hashArray = new Uint8Array(hashBuffer);
//     const hashHex = Array.from(hashArray).map(byte => byte.toString(16).padStart(2, '0')).join('');
//     return BigInt('0x' + hashHex);
// }
// async function generateRandomBigInteger() {
//     const randomBytes = new Uint8Array(256);
//     window.crypto.getRandomValues(randomBytes);
//     return BigInt('0x' + Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join(''));
// }

// async function hash(...inputs) {
//     const encoder = new TextEncoder();
//     const data = inputs.map(input => encoder.encode(input));
//     const buffer = await crypto.subtle.digest('SHA-256', concatUint8Arrays(...data));
//     return arrayBufferToHex(buffer);
// }

// async function hmac(key, ...inputs) {
//     const encoder = new TextEncoder();
//     const keyBuffer = encoder.encode(key);
//     const keyCryptoKey = await crypto.subtle.importKey('raw', keyBuffer, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
//     const data = inputs.map(input => encoder.encode(input));
//     const buffer = await crypto.subtle.sign('HMAC', keyCryptoKey, concatUint8Arrays(...data));
//     return arrayBufferToHex(buffer);
// }

// function concatUint8Arrays(...arrays) {
//     let totalLength = 0;
//     for (const arr of arrays) {
//         totalLength += arr.length;
//     }
//     const result = new Uint8Array(totalLength);
//     let offset = 0;
//     for (const arr of arrays) {
//         result.set(arr, offset);
//         offset += arr.length;
//     }
//     return result;
// }

// function arrayBufferToHex(buffer) {
//     const byteArray = new Uint8Array(buffer);
//     const hexParts = [];
//     byteArray.forEach(byte => {
//         const hex = byte.toString(16).padStart(2, '0');
//         hexParts.push(hex);
//     });
//     return hexParts.join('');
// }

// async function modularExponentiation(base, exponent, modulus) {
//     let result = 1n;
//     base = base % modulus;
//     while (exponent > 0n) {
//         if (exponent % 2n === 1n) {
//             result = (result * base) % modulus;
//         }
//         exponent = exponent >> 1n;
//         base = (base * base) % modulus;
//     }
//     return result;
// }

// export async function passwordClaimSignature(srpB, srpSalt, timestamp, secretBlock, deviceGroupKey, deviceKey, devicePassword) {
//     const N = BigInt('0x' + HEX_N);
//     const g = BigInt('0x' + HEX_G);
//     const k = await calculateK();

//     const fullPassword = await hash(deviceGroupKey, deviceKey, ":", devicePassword);

//     const B = BigInt('0x' + srpB);
//     const salt = BigInt('0x' + srpSalt);

//     if (B % N === 0n)
//         throw new Error("Bad server B");

//     const A = await generateRandomBigInteger();
//     const u = await hash(A.toString(16), B.toString(16));
//     if (u % N === 0n)
//         throw new Error("Hash of A and B cannot be zero");

//     const x = await hash(salt.toString(16), fullPassword);

//     const gExpXModN = modularExponentiation(g, x, N);
//     const kTimesGExpXModN = k * gExpXModN % N;
//     const APlusUX = A + u * x;
//     const BMinusKTimesGExpXModN = B - kTimesGExpXModN;

//     const S = modularExponentiation(BMinusKTimesGExpXModN, APlusUX, N);
//     const prk = await hmac(u.toString(16), S.toString(16));
//     const hkdf = await hmac(prk, DERIVED_KEY_INFO + String.fromCharCode(1)).slice(0, DERIVED_KEY_SIZE);

//     const signature = await hmac(
//         hkdf,
//         deviceGroupKey,
//         deviceKey,
//         new TextEncoder().encode(secretBlock),
//         new TextEncoder().encode(timestamp)
//     );

//     return btoa(String.fromCharCode.apply(null, new Uint8Array(signature)));
// }

// export async function passwordVerifierConfig(deviceGroupKey, deviceKey) {
//     const N = BigInt('0x' + HEX_N);
//     const g = BigInt('0x' + HEX_G);

//     const randomPassword = await generateRandomBase64String(40);
//     const fullPassword = await hash(deviceGroupKey, deviceKey, ":", randomPassword);

//     const salt = await generateRandomBase64String(16);
//     const x = await hash(salt.toString(), fullPassword);
//     const verifier = modularExponentiation(g, x, N).toString(16);

//     return {
//         devicePassword: randomPassword,
//         passwordVerifier: verifier,
//         salt: salt
//     };
// }

// async function generateRandomBase64String(length) {
//     const randomBytes = new Uint8Array(length);
//     window.crypto.getRandomValues(randomBytes);
//     return btoa(String.fromCharCode.apply(null, randomBytes)).slice(0, length);
// }

// import { default as AuthenticationHelperWrapper } from "@aws-sdk/client-cognito-identity-provider";
// import { createHmac } from "crypto";
import {
    CognitoIdentityProviderClient,
    InitiateAuthCommand,
    AdminInitiateAuthCommand,
    RespondToAuthChallengeCommand,
  } from "@aws-sdk/client-cognito-identity-provider";
const clientSecret = "xxxxxxxx";
// import crypto from "crypto"
const client = new CognitoIdentityProviderClient({ region: "ap-south-1" });
// const AuthenticationHelper = AuthenticationHelperWrapper.default;
const clientId = "51uf6q4h1llc4n80hsle6lhqpk";
const userPoolId = "51uf6q4h1llc4n80hsle6lhqpk";
const calculateSRP_A = async () => {
  const userPoolName = userPoolId.split("_")[1];
//   const authenticationHelper = new AuthenticationHelper(userPoolName);
//   const SRP_A = authenticationHelper.largeAValue.toString(16);
const SRP_A=""
  return SRP_A;
};

// const initiateAuthResult = await client.send(
// //   new AdminInitiateAuthCommand({
// //     ClientId: clientId,
// //     UserPoolId: userPoolId,
// //     AuthFlow: "USER_SRP_AUTH",
// //     AuthParameters: {
// //       USERNAME: 'username', // ログインするユーザの名前
// //       PASSWORD: 'password', // ログインするユーザのパスワード
// //       SRP_A:"", // さっき算出したSRP_A
// //     //   SECRET_HASH: createHmac("sha256", clientSecret)
// //         // .update(username + clientId)
// //         // .digest("base64"),
// //     },
// //   })
// );

export const passwordClaimSignature = () => {
  return "";
};
export const passwordVerifierConfig = () => {
  return "";
};



// function generatePasswordClaimSignature(clientSecret, username, userPoolId) {
//     const message = username + userPoolId;
//     const hmac = crypto.createHmac('sha256', clientSecret);
//     hmac.update(message);
//     const signature = hmac.digest('base64');
//     return signature;
//   }
//   // Example usage:
//   const username = "hasnainaskari32@gmail.com";
//   const password = "String123@";
//   const passwordClaimSignature = generatePasswordClaimSignature(username, password);
//   console.log("PASSWORD_CLAIM_SIGNATURE:", passwordClaimSignature);
