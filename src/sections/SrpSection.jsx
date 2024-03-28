import React,{ useState } from "react";
import {
  adminRespondToAuthChallenge,
  signIn,
} from "../aws-utils";

function SrpSection() {
  const [username, setUserName] = useState("subhan.akram2400@gmail.com");
  const [password, setPassword] = useState("4qfm_eQTM2vc");
  const [mfa, setMfa] = useState("");
  const [confirmMfa, setConfirmMfa] = useState("");
  const login = async () => {
    const authObj = await signIn(username, password);
    console.log("Auth Object===", authObj);
    adminRespondToAuthChallenge(authObj,password);
  };

  return (
    <div>
      <h1 >* Aws SRP Auth</h1>
      <h3>Login</h3>
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
     
    </div>
  );
}

export default SrpSection;
