const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");
const requestRoutes = require("./routes/requestRoutes.js");
const matchRoutes = require("./routes/matchRoutes");
const messageRoutes = require("./routes/messageRoutes");
const authMiddleware = require("./middleware/auth");
const messageModel = require('./models/messageModel'); // Add this line
const userModel = require('./models/userModel'); // Add this line
const admin = require('firebase-admin');
const serviceAccount = require("../firebase/app1-24456-firebase-adminsdk-58p5t-47d465f79c.json");

console.log("Firebase Admin initialized successfully");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Replace with your frontend URL
    methods: ["GET", "POST"]
  }
});

console.log("Starting server setup...");

// Middleware
app.use(cors());
// app.use(cors({
//   origin: ["http://localhost:5173", "http://localhost:5174"],
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true
// }));
// console.log("CORS middleware enabled");

app.use(express.json());
console.log("JSON body parser middleware enabled");

// Routes
app.use("/api/users", userRoutes);
console.log("User routes configured");

app.use("/api/deliveries", authMiddleware, deliveryRoutes);
console.log("Delivery routes configured with authentication");

app.use("/api/requests", authMiddleware, requestRoutes);
console.log("Request routes configured with authentication");

app.use("/api/matches", authMiddleware, matchRoutes);
console.log("Match routes configured with authentication");

app.use("/api/messages", authMiddleware, messageRoutes);
console.log("Message routes configured with authentication");

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    const decodedToken = await admin.auth().verifyIdToken(token);
    const firebaseUid = decodedToken.uid;
    const user = await userModel.getUserByFirebaseUid(firebaseUid);
    if (!user) {
      return next(new Error("Authentication error: User not found"));
    }
    socket.user = { id: user.id, firebaseUid: user.firebase_uid }; // Ensure this is the database user ID
    next();
  } catch (error) {
    console.error("Socket authentication error:", error);
    next(new Error("Authentication error"));
  }
});
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join room", (matchId) => {
    socket.join(matchId);
    console.log(`User ${socket.id} joined room: ${matchId}`);
  });

  socket.on("chat message", async (messageData) => {

    try {

      const { matchId, content } = messageData;
      const userId = socket.user.id; // Use the database user ID
      console.log("Received chat message:", { matchId, content, userId });
      
      // Save the message to the database
      const newMessage = await messageModel.createMessage(matchId, userId, content);
      console.log("New message created:", newMessage);
      
      // Broadcast the message to all clients in the room
      io.to(matchId).emit("new message", newMessage);
      console.log("Message broadcasted to room:", matchId);
    } catch (error) {
      console.error("Error saving and broadcasting message:", error);
      socket.emit("error", { message: "Failed to send message", details: error.message });
    }
  });
  socket.on("leave room", (matchId) => {
    socket.leave(matchId);
    console.log(`User ${socket.id} left room: ${matchId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
