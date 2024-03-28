import React, { useState } from "react";
import {
  createUser,
  initiateAuth,
  newPassword,
  passwordReset,
} from "../aws-utils/basicAuthentication";

function AWSSimpleAuthenticaltion() {
  const [username, setUserName] = useState("subhan.akram2400@gmail.com");
  const [password, setPassword] = useState("4qfm_eQTM2vc");
  const [newPasswordVal, setNewPasswordVal] = useState("4qfm_eQTM2vc");
  const [tempPass, setTempPass] = useState("4qfm_eQTM2vc");
  async function login(username, password) {
    try {
      const authResult = await initiateAuth(username, password);
      if (authResult) {
        alert("Login successfull check your response in console");
        console.log(authResult);
      }
    } catch (error) {
      alert("Something went wrong");
      console.error("Login failed:", error);
      throw error;
    }
  }
  async function userCreation(username, tempPassword, email) {
    try {
      const authResult = await createUser(username, tempPassword, email);
      if (authResult) {
        alert("User has been created successfully");
        console.log(authResult);
      }
    } catch (error) {
      // alert("Something went wrong");
      console.error("Login failed:", error);
      throw error;
    }
  }
  async function handleSetNewPassword(username, password, newPasswordAtribute) {
    try {
      const resetPasswordRes = await passwordReset(username, password);
      if (resetPasswordRes) {
        // debugger

        const newPasswordRes = await newPassword(resetPasswordRes.Session, {
          NEW_PASSWORD: newPasswordAtribute,
          USERNAME: username,
          // "userAttributes.address": "",
          // "userAttributes.name": "",
          // "userAttributes.phone": "",
        });
        console.log("new password set ",newPasswordRes)
        if (newPasswordRes) {
          // alert("New pass has been set successfully");
        }
      }
    } catch (error) {
      // alert("Something went wrong");
      console.error("Login failed:", error);
      throw error;
    }
  }
  return (
    <div>
       <h1>* User Simple Signup and Login</h1>
      <h3>User login </h3>
      <input
        value={username}
        placeholder="user name"
        onChange={(e) => {
          setUserName(e.target.value);
        }}
        className=""
      ></input>
      <input
        value={password}
        placeholder="password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        className=""
      ></input>
      <button
        onClick={() => {
          login(username, password);
        }}
      >
        Login
      </button>

      <h3>User creation By Admin</h3>
      <input
        value={username}
        placeholder="user name"
        onChange={(e) => {
          setUserName(e.target.value);
        }}
      ></input>
      <input
        value={tempPass}
        placeholder="tempPass"
        onChange={(e) => {
          setTempPass(e.target.value);
        }}
      ></input>
      <button
        onClick={() => {
          userCreation(username, tempPass, username);
        }}
      >
        Create
      </button>

      <h3>Set New Password</h3>
      <input
        value={username}
        placeholder="user name"
        onChange={(e) => {
          setUserName(e.target.value);
        }}
      ></input>
      <p>Old Password</p>
      <input disabled value={password}></input>
      <input
        value={password}
        placeholder="New Password"
        onChange={(e) => {
          setNewPasswordVal(e.target.value);
        }}
      ></input>
      <button
        onClick={() => {
          handleSetNewPassword(username, password, newPasswordVal);
        }}
      >
        Create
      </button>
    </div>
  );
}

export default AWSSimpleAuthenticaltion;
