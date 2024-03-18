import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { adminRespondToAuthChallenge, getCurrentTimestamp, signIn } from './aws-utils'

function App() {
  const [username, setUserName] = useState("subhan.akram2400@gmail.com")
  const [password,setPassword]=useState("samsungj300")
  const [mfa,setMfa]=useState("")
  const [confirmMfa,setConfirmMfa]=useState("")
  const login=async()=>{
   const authObj= await signIn(username,password);
   console.log("auth obj===",authObj)
   adminRespondToAuthChallenge(authObj)

  }
  getCurrentTimestamp() 
  return (
   <div>
     <h1 onClick={getCurrentTimestamp}>Aws SDK with AUTH</h1>
      <p>Login</p>
     <input value={username} placeholder='user name' onChange={(e)=>{setUserName(e.target.value)}} className=''></input>
     <input value={password} placeholder='password' onChange={(e)=>{setPassword(e.target.value)}} className=''></input>
    <button onClick={login}>Sign In</button>
   <h1>Enter Mfa Code</h1>
   <input value={mfa} placeholder='Enter Mfa Code' onChange={(e)=>{setMfa(e.target.value)}} className=''></input>
   {/* <button onClick={()=>{signIn(username,password)}}>Sign In</button> */}
   <h1>Confirm Mfa Code</h1>
   <input value={confirmMfa} placeholder='Enter Mfa Code' onChange={(e)=>{setConfirmMfa(e.target.value)}} className=''></input>
   </div>
  )
}

export default App
