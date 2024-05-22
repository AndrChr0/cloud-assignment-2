import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {

  const navigate = useNavigate()
  return (
    <div className="landingpage">
      <div>
        <div>
          <h1>Welcome to fake reddit</h1>
          <p>Your place for posting posts and liking them. </p>
        </div>
        <div style={{ marginTop: "100px" }}>
          <button onClick={()=>navigate('/register')}>Try out now!</button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
