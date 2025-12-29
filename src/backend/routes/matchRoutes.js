const express = require("express");
const router = express.Router();
const matchController = require("../controllers/matchController");
const authMiddleware = require("../middleware/auth");

// Route to create a new match
router.post("/match", authMiddleware, matchController.matchRequestsAndDeliveries);

// Route to get active match for a user
router.get("/active", matchController.getActiveMatch);

// Route to check for a match
router.get("/check", authMiddleware, matchController.checkForMatch);
router.get("/:matchId", authMiddleware, matchController.getMatchDetails);

module.exports = router;