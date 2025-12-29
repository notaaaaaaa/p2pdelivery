import React, { useState } from "react";
import "./LoginForm.css";
import { FaUser, FaLock } from "react-icons/fa";
import { doSignInWithEmailAndPassword } from "../firebase/auth";
import { useAuth } from "../contexts/authContext";
import { Navigate, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const { userLoggedIn, setUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState(""); // Fixed: Changed SetEmail to setEmail
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        const userCredential = await doSignInWithEmailAndPassword(
          email,
          password
        );
        setUser(userCredential.user);
        navigate("/home");
      } catch (error) {
        setErrorMessage("Invalid email or password");
      } finally {
        setIsSigningIn(false);
      }
    }
  };

  if (userLoggedIn) {
    return <Navigate to="/home" replace={true} />;
  }

  return (
    <div className="wrapper">
      <form onSubmit={onSubmit}>
        <h1 style={{ color: "white" }}>LOGIN</h1>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="input-box">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FaUser className="icon" />
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FaLock className="icon" />
        </div>
        <div className="remember-forgot">
          <label>
            <input type="checkbox" />
            Remember me
          </label>
          <a href="#">Forgot Password?</a>
        </div>

        <button type="submit" disabled={isSigningIn}>
          {isSigningIn ? "Signing In..." : "Login"}
        </button>
        <div className="register-link">
          <p>
            Don't have an account? <a href="/register">Register</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
