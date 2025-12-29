import React from "react";
import { AuthProvider } from "./contexts/authContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Components/home";
import Request from "./Components/request";
import Deliver from "./Components/deliver";
import MatchWaiting from "./Components/MatchWaiting";
import LoginForm from "./Components/LoginForm";
import RegistrationForm from "./Components/RegistrationForm";
import Chat from "./Components/chat";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/request" element={<Request />} />
          <Route path="/deliver" element={<Deliver />} />
          <Route path="/match-waiting" element={<MatchWaiting />} />
          <Route path="/chat/:matchId" element={<Chat />} />
          <Route path="/" element={<LoginForm />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
