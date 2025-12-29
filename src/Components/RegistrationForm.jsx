import React from "react";
import "./LoginForm.css";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaIdBadge } from "react-icons/fa";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { doCreateUserWithEmailAndPassword } from "../firebase/auth";
import { useState } from "react";
import { registerUser } from "../api";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    rollNumber: "",
    phoneNumber: "",
    password: "",
    year: "",
    hostelNumber: "",
    roomNumber: "",
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isRegistering) {
      setIsRegistering(true);
      try {
        const firebaseUser = await doCreateUserWithEmailAndPassword(
          formData.email,
          formData.password
        );
        const userData = {
          name: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          hostelNumber: formData.hostelNumber,
          roomNumber: formData.roomNumber,
          firebaseUid: firebaseUser.user.uid,
        };
        const response = await registerUser(userData);
        console.log("Registration successful:", response);
        navigate("/login");
      } catch (error) {
        console.error("Registration error:", error);
        setErrorMessage(error.response?.data?.error || "Registration failed");
      } finally {
        setIsRegistering(false);
      }
    }
  };
  if (userLoggedIn) {
    return <Navigate to="/home" replace={true} />;
  }

  return (
    <>
      {userLoggedIn && <Navigate to={"/home"} replace={true} />}

      <div className="wrapper">
        <form action="" onSubmit={onSubmit}>
          <h1>REGISTER</h1>
          <div className="input-box">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              required
              value={formData.fullName}
              onChange={handleChange}
            />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input
              type="email"
              name="email"
              placeholder="College Email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <FaEnvelope className="icon" />
          </div>
          <div className="input-box">
            <input type="text" placeholder="Roll Number" required />
            <FaIdBadge className="icon" />
          </div>
          <div className="input-box">
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              required
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            <FaPhone className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <FaLock className="icon" />
          </div>
          <div className="input-box">
            <input type="number" placeholder="Year" required />
          </div>
          <div className="input-box">
            <input
              type="text"
              name="hostelNumber"
              placeholder="Hostel Number"
              required
              value={formData.hostelNumber}
              onChange={handleChange}
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              name="roomNumber"
              placeholder="Room Number"
              required
              value={formData.roomNumber}
              onChange={handleChange}
            />
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox" />I agree to the terms and conditions
            </label>
          </div>

          <button type="submit">Register</button>
          <div className="login-link">
            <br />
            <p>
              Already have an account? <a href="#">Login</a>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default RegistrationForm;
