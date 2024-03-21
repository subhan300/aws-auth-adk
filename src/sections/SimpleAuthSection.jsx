import React,{ useState } from "react";
import {
  adminRespondToAuthChallenge,
  getCurrentTimestamp,
  signIn,
} from "../aws-utils";

function SimpleAuthSection() {
  const [username, setUserName] = useState("subhan.akram2400@gmail.com");
  const [password, setPassword] = useState("samsungj300");
  const [mfa, setMfa] = useState("");
  const [confirmMfa, setConfirmMfa] = useState("");
  const login = async () => {
    const authObj = await signIn(username, password);
    console.log("auth obj===", authObj);
    adminRespondToAuthChallenge(authObj);
  };
  getCurrentTimestamp();
  return (
    <div>
      <h2 onClick={getCurrentTimestamp}>* Aws SRP Auth</h2>
      <p>Login</p>
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
      <button onClick={login}>Sign In</button>
      <p>Enter Mfa Code</p>
      <input
        value={mfa}
        placeholder="Enter Mfa Code"
        onChange={(e) => {
          setMfa(e.target.value);
        }}
        className=""
      ></input>
      {/* <button onClick={()=>{signIn(username,password)}}>Sign In</button> */}
      <p>Confirm Mfa Code</p>
      <input
        value={confirmMfa}
        placeholder="Enter Mfa Code"
        onChange={(e) => {
          setConfirmMfa(e.target.value);
        }}
        className=""
      ></input>
    </div>
  );
}

export default SimpleAuthSection;