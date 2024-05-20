import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  const [userCount, setUserCount] = useState(0);
  const api = import.meta.env.VITE_URL;

  useEffect(() => {
    axios
      .get(`${api}/`)
      .then((response) => {
        setUserCount(response.data.user_count);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  return (
    <div>
      <h1>Welcome to fake reddit</h1>
        <p>Your place for posting posts and liking them. </p>
        <Link to="/register">Register here</Link>
    </div>
  );
};

export default Landing;
