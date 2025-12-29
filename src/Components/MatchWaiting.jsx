import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { checkForMatch } from "../api";
import { useAuth } from "../contexts/authContext";

const MatchWaiting = () => {
  const { user } = useAuth();
  const [isMatched, setIsMatched] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { type, id } = location.state || {};

  useEffect(() => {
    if (!user) {
      console.log("No user logged in");
      navigate("/login");
      return;
    }

    if (!type) {
      console.error("Missing type in MatchWaiting");
      navigate("/");
      return;
    }

    const checkMatch = async () => {
      try {
        const result = await checkForMatch();
        console.log("Check for match result:", result);
        if (result && result.match && result.isNewMatch) {
          setIsMatched(true);
          navigate(`/chat/${result.match.id}`);
        }
      } catch (error) {
        console.error("Error checking for match:", error);
      }
    };

    const interval = setInterval(checkMatch, 2000);
    checkMatch();
    return () => clearInterval(interval);
  }, [navigate, type, user]);

  if (!type) {
    return <div>Error: Missing information. Redirecting...</div>;
  }

  return (
    <div>
      <h2>Waiting for a {type === "request" ? "deliverer" : "requester"}...</h2>
      {/* Add a loading spinner or animation here */}
    </div>
  );
};

export default MatchWaiting;
