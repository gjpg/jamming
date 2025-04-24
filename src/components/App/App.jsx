import React, { useState, useEffect } from "react";
import Login from "../Login";
import Dashboard from "../Dashboard/Dashboard";

const code = new URLSearchParams(window.location.search).get("code");

function App() {
  return code ? <Dashboard code={code} /> : <Login />;
}

export default App;
