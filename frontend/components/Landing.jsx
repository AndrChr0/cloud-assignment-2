import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Landing = () => {

  return (
    <div>
      <h1>Welcome to fake reddit</h1>
        <p>Your place for posting posts and liking them. </p>
        <Link to="/register">Register here</Link>
    </div>
  );
};

export default Landing;
