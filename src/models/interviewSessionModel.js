const pool = require("../config/db");

const createSession = async ({
  userId,
  role,
  difficulty,
  interviewType,
  durationMinutes,
  totalQuestions,
}) => {
  const [result] = await pool.query(
    "INSERT INTO interview_sessions (user_id, role, difficulty, interview_type, duration_minutes, total_questions) VALUES (?, ?, ?, ?, ?, ?)",
    [userId, role, difficulty, interviewType, durationMinutes, totalQuestions]
  );

  return {
    id: result.insertId,
    userId,
    role,
    difficulty,
    interviewType,
    durationMinutes,
    totalQuestions,
  };
};

const findById = async (sessionId) => {
  const [rows] = await pool.query(
    "SELECT * FROM interview_sessions WHERE id = ? LIMIT 1",
    [sessionId]
  );

  return rows[0] || null;
};

const findByIdForUser = async (sessionId, userId) => {
  const [rows] = await pool.query(
    "SELECT * FROM interview_sessions WHERE id = ? AND user_id = ? LIMIT 1",
    [sessionId, userId]
  );

  return rows[0] || null;
};

const incrementQuestionIndex = async (sessionId) => {
  await pool.query(
    "UPDATE interview_sessions SET current_question_index = current_question_index + 1 WHERE id = ?",
    [sessionId]
  );
};

const incrementAnswered = async (sessionId, score) => {
  await pool.query(
    "UPDATE interview_sessions SET answered_questions = answered_questions + 1, score_total = score_total + ? WHERE id = ?",
    [score, sessionId]
  );
};

const markCompleted = async (sessionId) => {
  await pool.query(
    "UPDATE interview_sessions SET status = 'completed', completed_at = CURRENT_TIMESTAMP WHERE id = ?",
    [sessionId]
  );
};

const listByUser = async (userId) => {
  const [rows] = await pool.query(
    "SELECT id, role, difficulty, interview_type AS interviewType, duration_minutes AS durationMinutes, total_questions AS totalQuestions, answered_questions AS answeredQuestions, status, started_at AS startedAt, completed_at AS completedAt FROM interview_sessions WHERE user_id = ? ORDER BY started_at DESC",
    [userId]
  );

  return rows;
};

module.exports = {
  createSession,
  findById,
  findByIdForUser,
  incrementQuestionIndex,
  incrementAnswered,
  markCompleted,
  listByUser,
};
