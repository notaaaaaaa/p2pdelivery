const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController");
const authMiddleware = require("../middleware/auth");


// Route to create a new request
router.post("/", authMiddleware, requestController.createRequest);

// Route to get pending requests for a specific restaurant
router.get("/:restaurantId", requestController.getPendingRequests);

module.exports = router;