import React,{ useState } from "react";
import "./App.css";
import SrpSection from "./sections/SrpSection";
import AWSSimpleAuthenticaltion from "./sections/AWSSimpleAuthentication";

function App() {
 console.log("Confirm Env Variables",process.env)
  return (
    <div>
       <h1 style={{color:"brown",fontWeight:"bold"}}>AWS SDK AUTH </h1>
       <SrpSection />
       <AWSSimpleAuthenticaltion />
    </div>
  );
}

export default App;
