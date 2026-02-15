const express = require("express");
const interviewController = require("../controllers/interviewController");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.use(authenticate);

router.post("/sessions", interviewController.startSession);
router.get("/sessions", interviewController.getHistory);
router.get("/sessions/:sessionId", interviewController.getSessionDetail);
router.post(
  "/sessions/:sessionId/questions/next",
  interviewController.nextQuestion,
);
router.post("/sessions/:sessionId/answers", interviewController.submitAnswer);
router.post("/sessions/:sessionId/finish", interviewController.finishSession);

module.exports = router;
