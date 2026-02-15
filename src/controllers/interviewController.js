const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { sendSuccess } = require("../utils/response");
const interviewService = require("../services/interviewService");

const startSession = asyncHandler(async (req, res) => {
  const { role, difficulty, interviewType, durationMinutes, totalQuestions } = req.body || {};

  if (!role || !interviewType) {
    throw new AppError("Role and interview type are required", 400);
  }

  const session = await interviewService.startSession({
    userId: req.user.id,
    role,
    difficulty,
    interviewType,
    durationMinutes,
    totalQuestions,
  });

  return sendSuccess(res, session, 201);
});

const nextQuestion = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const question = await interviewService.getNextQuestion({
    sessionId,
    userId: req.user.id,
  });

  return sendSuccess(res, question);
});

const submitAnswer = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { questionId, answer } = req.body || {};

  if (!questionId) {
    throw new AppError("Question id is required", 400);
  }

  const result = await interviewService.submitAnswer({
    sessionId,
    userId: req.user.id,
    questionId,
    answerText: answer,
  });

  return sendSuccess(res, result);
});

const finishSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const report = await interviewService.finishSession({
    sessionId,
    userId: req.user.id,
  });

  return sendSuccess(res, report);
});

const getHistory = asyncHandler(async (req, res) => {
  const sessions = await interviewService.getHistory({ userId: req.user.id });
  return sendSuccess(res, sessions);
});

const getSessionDetail = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const detail = await interviewService.getSessionDetail({
    sessionId,
    userId: req.user.id,
  });

  return sendSuccess(res, detail);
});

module.exports = {
  startSession,
  nextQuestion,
  submitAnswer,
  finishSession,
  getHistory,
  getSessionDetail,
};
