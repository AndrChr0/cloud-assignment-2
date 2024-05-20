import axios from "axios";
import React, { useEffect, useState } from "react";

const Landing = () => {
  const [userCount, setUserCount] = useState(0);

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
      <h1>Number of Users</h1>
      <p>{userCount}</p>
    </div>
  );
};

export default Landing;
