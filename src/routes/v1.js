const express = require("express");
const healthController = require("../controllers/healthController");
const authRoutes = require("./authRoutes");
const interviewRoutes = require("./interviewRoutes");

const router = express.Router();

router.get("/health", healthController.getHealth);
router.use("/auth", authRoutes);
router.use("/interviews", interviewRoutes);

module.exports = router;
