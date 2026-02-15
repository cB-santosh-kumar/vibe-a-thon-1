const pool = require("../config/db");

const createQuestion = async ({ sessionId, questionText, difficulty, isFollowup, orderIndex }) => {
  const [result] = await pool.query(
    "INSERT INTO interview_questions (session_id, question_text, difficulty, is_followup, order_index) VALUES (?, ?, ?, ?, ?)",
    [sessionId, questionText, difficulty, isFollowup ? 1 : 0, orderIndex]
  );

  return {
    id: result.insertId,
    sessionId,
    questionText,
    difficulty,
    isFollowup: !!isFollowup,
    orderIndex,
  };
};

const getLastQuestion = async (sessionId) => {
  const [rows] = await pool.query(
    "SELECT id, question_text AS questionText, difficulty, is_followup AS isFollowup, order_index AS orderIndex FROM interview_questions WHERE session_id = ? ORDER BY order_index DESC LIMIT 1",
    [sessionId]
  );

  return rows[0] || null;
};

const countFollowups = async (sessionId) => {
  const [rows] = await pool.query(
    "SELECT COUNT(*) AS count FROM interview_questions WHERE session_id = ? AND is_followup = 1",
    [sessionId]
  );

  return rows[0]?.count || 0;
};

const listBySession = async (sessionId) => {
  const [rows] = await pool.query(
    "SELECT id, question_text AS questionText, difficulty, is_followup AS isFollowup, order_index AS orderIndex FROM interview_questions WHERE session_id = ? ORDER BY order_index ASC",
    [sessionId]
  );

  return rows;
};

module.exports = { createQuestion, getLastQuestion, countFollowups, listBySession };
