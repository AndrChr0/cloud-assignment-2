import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useReddit } from "../Context";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const api = import.meta.env.VITE_URL;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const { setIsLoggedIn } = useReddit();

  // Function to add user information to local storage
  const adUserToLocalStorage = (username, id) => {
    localStorage.setItem("user", username);
    localStorage.setItem("userID", id);
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to the login endpoint with the username and password
      const response = await axios.post(`${api}/login`, {
        username,
        password,
      });
      // Add the user information to local storage
      adUserToLocalStorage(username, response.data.user_id);
      // Set the message state with the response message
      setMessage(response.data.message);
      // Set the isLoggedIn state to true
      setIsLoggedIn(true);
      // Navigate to the home page
      navigate("/home");
    } catch (error) {
      // Set the message state with the error message from the response
      setMessage(error.response.data.error);
    }
  };

  return (
    <div className="login">
      <h2>Log in</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />

          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          {message && (
            <p style={{ color: "red", fontSize: "11px", marginTop: "-15px" }}>
              {message}
            </p>
          )}
          <p style={{ fontSize: "15px" }}>
            New to Fake Reddit?{" "}
            <Link
              style={{ textDecoration: "none", color: "#648EFC" }}
              to="/register"
            >
              Register
            </Link>
          </p>
        </div>

        <div>
          <button type="submit">Log in</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
