const express = require("express");
const router = express.Router();
const deliveryController = require("../controllers/deliveryController");
const authMiddleware = require("../middleware/auth");
router.post("/", authMiddleware, deliveryController.createDelivery);
router.get("/:restaurantId", deliveryController.getAvailableDeliveries);

module.exports = router;
