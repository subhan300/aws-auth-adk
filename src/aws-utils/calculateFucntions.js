import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  AdminInitiateAuthCommand,
  RespondToAuthChallengeCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { Buffer } from 'buffer';
import { createHmac } from "crypto-js";
import { default as AuthenticationHelperWrapper } from "../aws-services/AuthenticationHelper";
import { default as BigIntegerWrapper } from "../aws-services/BigIntegar";
import { default as DateHelperWrapper } from "../aws-services/DateHelper";
const DateHelper = DateHelperWrapper;
const BigInteger = BigIntegerWrapper;

const clientId = "51uf6q4h1llc4n80hsle6lhqpk";
const userPoolId = "ap-south-1_iUi5jchz5";
const client = new CognitoIdentityProviderClient({ region: "ap-south-1" });
async function generateHmac(message, key) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);

  const importedKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    importedKey,
    data
  );

  // Convert the signature buffer to base64
  const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)));

  return signatureBase64;
}

export const calculateSRP_A = async (userPoolId) => {
  const userPoolName = userPoolId.split("_")[1];
  const authenticationHelper = new AuthenticationHelperWrapper(userPoolName);
  const SRP_A = authenticationHelper.largeAValue.toString(16);
  return { SRP_A, authenticationHelper };
};

export const passwordClaimSignature =async (
  username,
  password,
  SRP_B,
  SALT,
  SECRET_BLOCK
) => {
  const userPoolName = userPoolId.split("_")[1];
  const authenticationHelper = new AuthenticationHelperWrapper(userPoolName);
  const hkdfResult = { hkdf: "" };
  authenticationHelper.getPasswordAuthenticationKey(
    username,
    password,
    new BigInteger(SRP_B, 16),
    new BigInteger(SALT, 16),
    (err, result) => {
      hkdfResult.hkdf = result;
    }
  );

  const dateHelper = new DateHelper();
  const dateNow = dateHelper.getNowString();
  const msg = Buffer.concat([
    Buffer.from(userPoolName, "utf-8"),
    Buffer.from(username, "utf-8"),
    Buffer.from(SECRET_BLOCK, "base64"),
    Buffer.from(dateNow, "utf-8"),
  ]);

  // PASSWORD_CLAIM_SIGNATURE を作成
  const signature =await generateHmac(msg, hkdfResult.hkdf)
    // .update(msg)
    // .digest("base64");

  return {signature,dateNow};
};
export const passwordVerifierConfig = () => {
  return "";
};
