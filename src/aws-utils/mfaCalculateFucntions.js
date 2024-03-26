import {
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import { Buffer } from 'buffer';
import CryptoJS from 'crypto-js/core';
import { default as AuthenticationHelperWrapper } from "../aws-services/AuthenticationHelper";
import { default as BigIntegerWrapper } from "../aws-services/BigIntegar";
import { default as DateHelperWrapper } from "../aws-services/DateHelper";
import 'crypto-js/hmac';
import 'crypto-js/sha256';
const DateHelper = DateHelperWrapper;
const BigInteger = BigIntegerWrapper;

const userPoolId =process.env.USER_POOL_ID;



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

  // const signature =  createHmac('sha256', hkdfResult.hkdf)
  // .update(msg)
  // .digest('base64');
  const keyWordArray =  parseInt(hkdfResult.hkdf, 16).toString();

  const msgBytes = CryptoJS.enc.Utf8.parse(msg);
  
  const hmacDigest = CryptoJS.HmacSHA256(msgBytes, keyWordArray);
  
  const signature = hmacDigest.toString(CryptoJS.enc.Base64);
  return {signature,dateNow};
};
