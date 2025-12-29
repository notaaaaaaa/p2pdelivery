const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");


const authMiddleware = require("../middleware/auth");

// Apply auth middleware to all routes
router.use(authMiddleware);
// Route to get messages for a specific match
router.get("/:matchId", messageController.getMessages);

module.exports = router;