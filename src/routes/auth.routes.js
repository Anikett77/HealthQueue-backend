const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.controller");
const { authenticate } = require("../middlewares/auth");

// Register new user
router.post("/register", authController.register);

// Login user
router.post("/login", authController.login);

// Get current user (protected)
router.get("/me", authenticate, authController.getMe);

module.exports = router;

