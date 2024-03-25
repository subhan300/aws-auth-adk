import React,{ useState } from "react";
import { createUser, initiateAuth, newPassword, passwordReset } from "../aws-utils/basicAuthentication";

function AWSSimpleAuthenticaltion() {
  const [username, setUserName] = useState("subhan.akram2400@gmail.com");
  const [password, setPassword] = useState("samsung@@@0J");
  const [tempPass,setTempPass] = useState("")
  async function login(username, password) {
    try {
        const authResult = await initiateAuth(username, password);
        if (authResult) {
          alert("Login successfull check your response in console")
          console.log(authResult);
        } 
    } catch (error) {
        alert("Something went wrong")
        console.error('Login failed:', error);
        throw error;
    }
}
async function userCreation(username, tempPassword,email) {
    try {
        const authResult = await createUser(username, tempPassword,email);
        if (authResult) {
          alert("User has been created successfully")
          console.log(authResult);
        } 
    } catch (error) {
        alert("Something went wrong")
        console.error('Login failed:', error);
        throw error;
    }
}
async function handleSetNewPassword(username,password) {
    try {
        const session = await passwordReset(username, password);
        if(session){
        //Assuming you have obtained session object and user provided a new password
        const res = await newPassword(session.Session,password);
        if(res){
            alert("New pass has been set successfully")
        }
        }
    } catch (error) {
        alert("Something went wrong")
        console.error('Login failed:', error);
        throw error;
    }
}
console.log(tempPass,"tempPass");
  return (
    <div>
      <h2>User login which is created By Admin</h2>
      <p>Create</p>
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
      <button onClick={()=>{login(username,password)}}>Login</button>

      <h2>User creation By Admin</h2>
      <p>Login</p>
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
      <button onClick={()=>{userCreation(username,tempPass,username)}}>Create</button>

      <h2>Set New Password</h2>
      <p>Login</p>
      <input
        value={username}
        placeholder="user name"
        onChange={(e) => {
          setUserName(e.target.value);
        }}  
      ></input>
      <input
        value={password}
        placeholder="New Password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        
      ></input>
      <button onClick={()=>{handleSetNewPassword(username,password)}}>Create</button>
    </div>
  );
}

export default AWSSimpleAuthenticaltion;
