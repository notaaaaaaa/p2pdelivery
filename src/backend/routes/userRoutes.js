const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");

// router.use(authMiddleware);
router.get("/:uid", authMiddleware, userController.getUserByFirebaseUid);

// Route to register a new user
router.post("/register", userController.registerUser);

module.exports = router;
