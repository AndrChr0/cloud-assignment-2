import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const api = import.meta.env.VITE_URL;

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to the registration endpoint with the user data
      const response = await axios.post(`${api}/register`, {
        username,
        email,
        password,
      });
      // Redirect to the login page after successful registration
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Registration failed.");
    }
  };

  return (
    <div className="login">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* {message && (
            <p style={{ color: "red", fontSize: "11px", marginTop: "-15px" }}>
              {message}
            </p>
          )} */}
          <p style={{ fontSize: "15px" }}>
            Already a Fake Redditor?{" "}
            <Link
              style={{ textDecoration: "none", color: "#648EFC" }}
              to="/login"
            >
              Log in
            </Link>
          </p>
        </div>

        <div>
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
