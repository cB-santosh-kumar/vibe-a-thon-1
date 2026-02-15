const AppError = require("../utils/AppError");
const interviewSessionModel = require("../models/interviewSessionModel");
const interviewQuestionModel = require("../models/interviewQuestionModel");
const interviewAnswerModel = require("../models/interviewAnswerModel");
const interviewReportModel = require("../models/interviewReportModel");
const ollamaService = require("./ollamaService");

const normalizeDifficulty = (difficulty) => {
  const value = (difficulty || "medium").toLowerCase();
  if (value === "easy" || value === "hard") {
    return value;
  }
  return "medium";
};

const adjustDifficulty = (current, score) => {
  if (score >= 8) {
    return "hard";
  }
  if (score <= 4) {
    return "easy";
  }
  return current;
};

const startSession = async ({
  userId,
  role,
  difficulty,
  interviewType,
  durationMinutes,
  totalQuestions,
}) => {
  if (!role || !interviewType) {
    throw new AppError("Role and interview type are required", 400);
  }

  const normalizedDifficulty = normalizeDifficulty(difficulty);
  const duration = Number(durationMinutes) || 20;
  const questions = Number(totalQuestions) || 8;

  return interviewSessionModel.createSession({
    userId,
    role,
    difficulty: normalizedDifficulty,
    interviewType,
    durationMinutes: duration,
    totalQuestions: questions,
  });
};

const getNextQuestion = async ({ sessionId, userId }) => {
  const session = await interviewSessionModel.findByIdForUser(sessionId, userId);
  if (!session) {
    throw new AppError("Session not found", 404);
  }

  if (session.status === "completed") {
    throw new AppError("Session already completed", 409);
  }

  if (session.current_question_index >= session.total_questions) {
    throw new AppError("No more questions", 409);
  }

  const lastQuestion = await interviewQuestionModel.getLastQuestion(sessionId);
  const lastAnswer = await interviewAnswerModel.getLastAnswer(sessionId);
  const followups = await interviewQuestionModel.countFollowups(sessionId);

  const shouldFollowup = followups === 0 && !!lastAnswer;
  const nextDifficulty = lastAnswer
    ? adjustDifficulty(session.difficulty, lastAnswer.score)
    : session.difficulty;

  const questionPayload = await ollamaService.generateQuestion({
    role: session.role,
    difficulty: nextDifficulty,
    interviewType: session.interview_type,
    followup: shouldFollowup,
    lastAnswer: lastAnswer?.answerText,
    lastQuestion: lastQuestion?.questionText,
  });

  const orderIndex = session.current_question_index + 1;
  const question = await interviewQuestionModel.createQuestion({
    sessionId,
    questionText: questionPayload.question,
    difficulty: questionPayload.difficulty || nextDifficulty,
    isFollowup: questionPayload.isFollowup || shouldFollowup,
    orderIndex,
  });

  await interviewSessionModel.incrementQuestionIndex(sessionId);

  return {
    sessionId,
    questionId: question.id,
    question: question.questionText,
    difficulty: question.difficulty,
    isFollowup: question.isFollowup,
    progress: {
      current: orderIndex,
      total: session.total_questions,
    },
  };
};

const submitAnswer = async ({ sessionId, userId, questionId, answerText }) => {
  if (!answerText) {
    throw new AppError("Answer is required", 400);
  }

  const session = await interviewSessionModel.findByIdForUser(sessionId, userId);
  if (!session) {
    throw new AppError("Session not found", 404);
  }

  if (session.status === "completed") {
    throw new AppError("Session already completed", 409);
  }

  const question = await interviewQuestionModel.getLastQuestion(sessionId);
  if (!question || question.id !== Number(questionId)) {
    throw new AppError("Question not found", 404);
  }

  const evaluation = await ollamaService.evaluateAnswer({
    role: session.role,
    difficulty: question.difficulty,
    question: question.questionText,
    answer: answerText,
  });

  await interviewAnswerModel.createAnswer({
    sessionId,
    questionId: question.id,
    answerText,
    score: evaluation.score,
    feedback: evaluation.feedback,
    strengths: evaluation.strengths,
    improvements: evaluation.improvements,
  });

  await interviewSessionModel.incrementAnswered(sessionId, evaluation.score);

  return {
    score: evaluation.score,
    feedback: evaluation.feedback,
    strengths: evaluation.strengths,
    improvements: evaluation.improvements,
  };
};

const finishSession = async ({ sessionId, userId }) => {
  const session = await interviewSessionModel.findByIdForUser(sessionId, userId);
  if (!session) {
    throw new AppError("Session not found", 404);
  }

  const answers = await interviewAnswerModel.listBySession(sessionId);
  if (answers.length === 0) {
    throw new AppError("No answers submitted", 400);
  }

  const report = await ollamaService.generateReport({
    role: session.role,
    difficulty: session.difficulty,
    answers,
  });

  const normalizedReport = {
    overallScore10: report.overallScore10 || 0,
    overallScore100: report.overallScore100 || 0,
    strengths: report.strengths || [],
    improvementAreas: report.improvementAreas || [],
    improvedAnswers: report.improvedSampleAnswers || report.improvedAnswers || [],
    nextTopics: report.nextTopics || [],
  };

  await interviewReportModel.upsertReport({
    sessionId,
    overallScore10: normalizedReport.overallScore10,
    overallScore100: normalizedReport.overallScore100,
    strengths: normalizedReport.strengths,
    improvementAreas: normalizedReport.improvementAreas,
    improvedAnswers: normalizedReport.improvedAnswers,
    nextTopics: normalizedReport.nextTopics,
  });

  await interviewSessionModel.markCompleted(sessionId);

  return normalizedReport;
};

const getHistory = async ({ userId }) => {
  return interviewSessionModel.listByUser(userId);
};

const getSessionDetail = async ({ sessionId, userId }) => {
  const session = await interviewSessionModel.findByIdForUser(sessionId, userId);
  if (!session) {
    throw new AppError("Session not found", 404);
  }

  const questions = await interviewQuestionModel.listBySession(sessionId);
  const answers = await interviewAnswerModel.listBySession(sessionId);
  const report = await interviewReportModel.getBySession(sessionId);

  return {
    session,
    questions,
    answers,
    report,
  };
};

module.exports = {
  startSession,
  getNextQuestion,
  submitAnswer,
  finishSession,
  getHistory,
  getSessionDetail,
};
