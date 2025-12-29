import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getMatchDetails, sendMessage, getMessages } from "../api";
import { Send } from "lucide-react";
import "./chat.css";
import io from "socket.io-client";
import { useAuth } from "../contexts/authContext";

const Chat = () => {
  const { user, userLoggedIn, getIdToken } = useAuth();
  const { matchId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [matchDetails, setMatchDetails] = useState(null);
  const [socket, setSocket] = useState(null);
  const messageListRef = useRef(null);

  useEffect(() => {
    if (userLoggedIn) {
      const backendUrl =
        window.location.port === "5173"
          ? "http://localhost:5000"
          : "http://localhost:5000";
      const newSocket = io(backendUrl, {
        auth: async (cb) => {
          const token = await getIdToken();
          cb({ token });
        },
      });
      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [userLoggedIn, getIdToken]);

  useEffect(() => {
    if (socket && matchId) {
      console.log("Joining room:", matchId);
      socket.emit("join room", matchId);

      socket.on("new message", (message) => {
        console.log("Received new message:", message);
        setMessages((prevMessages) => {
          console.log("Previous messages:", prevMessages);
          console.log("New messages state:", [...prevMessages, message]);
          return [...prevMessages, message];
        });
      });

      return () => {
        console.log("Leaving room:", matchId);
        socket.off("new message");
        socket.emit("leave room", matchId);
      };
    }
  }, [socket, matchId]);
  useEffect(() => {
    console.log("Messages updated:", messages);
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      try {
        const messageData = { matchId, content: newMessage, userId: user.id };
        console.log("Sending message:", messageData);
        socket.emit("chat message", messageData);
        setNewMessage("");
      } catch (err) {
        console.error("Error sending message:", err);
        setError("Failed to send message");
      }
    }
  };

  useEffect(() => {
    const fetchMatchDetails = async () => {
      if (userLoggedIn) {
        try {
          const details = await getMatchDetails(matchId);
          setMatchDetails(details);
        } catch (err) {
          console.error("Failed to load match details:", err);
          setError("Failed to load match details");
        }
      }
    };

    fetchMatchDetails();
  }, [userLoggedIn, matchId]);

  const fetchMessages = async () => {
    if (userLoggedIn) {
      try {
        const response = await getMessages(matchId);
        setMessages(response.data.messages || []);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load messages");
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (userLoggedIn) {
      fetchMessages();
    }
  }, [userLoggedIn, matchId]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);
  useEffect(() => {
    console.log("Current user ID (user.uid):", user.uid);
  }, [user]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat for Match #{matchId}</h2>
        {matchDetails && (
          <p>
            {matchDetails.requester_name} (Requester) and{" "}
            {matchDetails.deliverer_name} (Deliverer)
          </p>
        )}
      </div>

      <div className="message-list" ref={messageListRef}>
        {messages.map((message) => {
          console.log("Message sender_id:", message.sender_id);
          return (
            <div
              key={message.id}
              className={`message-wrapper ${
                message.sender_id === user.id ? "sent" : "received"
              }`}
            >
              <div
                className={`message ${
                  message.sender_id === user.id ? "sender" : "receiver"
                }`}
              >
                {message.content}
                <span className="timestamp">
                  {new Date(message.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="message-input"
        />
        <button type="submit" className="send-button">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default Chat;
