import React,{ useState } from "react";
import "./App.css";
import SrpSection from "./sections/SrpSection";
import AWSSimpleAuthenticaltion from "./sections/AWSSimpleAuthenticaltion";
import MfaSection from "./sections/MfaSection";

function App() {
 console.log("Confirm Env Variables",process.env)
  return (
    <div>
       <h1 style={{color:"brown",fontWeight:"bold"}}>AWS SDK AUTH </h1>
       <SrpSection />
       <AWSSimpleAuthenticaltion />
       <MfaSection />
    </div>
  );
}

export default App;
