import React,{ useState } from "react";
import "./App.css";
import SrpSection from "./sections/SrpSection";

function App() {
 console.log("Confirm Env Variables",process.env)
  return (
    <div>
       <h1 style={{color:"brown",fontWeight:"bold"}}>AWS SDK AUTH </h1>
       <SrpSection />
    </div>
  );
}

export default App;
