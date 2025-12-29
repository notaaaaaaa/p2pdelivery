import React, { useState } from "react";
import "./home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCog,
  faSignOutAlt,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { doSignOut } from "../firebase/auth";

const Home = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { userLoggedIn, user, setUser } = useAuth();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleRequest = () => {
    navigate("/request");
  };

  const handleDeliver = () => {
    navigate("/deliver");
  };

  const handleChat = () => {
    navigate("/match-waiting");
  };

  const handleLogout = async () => {
    try {
      await doSignOut();
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (!userLoggedIn) {
    return <Navigate to="/login" replace={true} />;
  }

  return (
    <div className="container">
      <header className="header">
        <div className="profile-menu">
          <button className="profile-button" onClick={toggleDropdown}>
            <FontAwesomeIcon icon={faUser} className="profile-icon" />
          </button>
          {showDropdown && (
            <div className="dropdown-menu">
              <ul>
                {/* <li>
                  <FontAwesomeIcon icon={faSignInAlt} />
                  <a href="#"> Login</a>
                </li> */}
                <li onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  <span>Logout</span>
                </li>
                <li>
                  <FontAwesomeIcon icon={faCog} />
                  <a href="#"> Settings</a>
                </li>
                <li>
                  <FontAwesomeIcon icon={faHistory} />
                  <a href="#"> Order History</a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      <div className="grid">
        <div className="grid-item first-row" style={{ gridColumn: "span 2" }}>
          <h1>Welcome back, Aravind</h1>
        </div>

        <div className="grid-item text-box" style={{ gridColumn: "2 / 5" }}>
          <p>
            The app is a peer-to-peer delivery platform designed exclusively for
            students. It allows students to request and offer delivery services
            within their campus community. Whether it's delivering food,
            packages, or textbooks, students can use the app to either be the
            sender or the deliverer. The app fosters convenience, as students
            can handle deliveries during their free time, earning extra income
            or helping peers with time-sensitive errands. With features like
            real-time tracking and secure payments, it ensures a seamless and
            safe experience.
          </p>
        </div>

        <div className="grid-item button-row">
          <button className="btn request" onClick={handleRequest}>
            Request
          </button>
          <button className="btn deliver" onClick={handleDeliver}>
            Deliver
          </button>
          <button className="btn chat" onClick={handleChat}>
            Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
