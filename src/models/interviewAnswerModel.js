const pool = require("../config/db");

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
};

const createAnswer = async ({
  sessionId,
  questionId,
  answerText,
  score,
  feedback,
  strengths,
  improvements,
}) => {
  const [result] = await pool.query(
    "INSERT INTO interview_answers (session_id, question_id, answer_text, score, feedback, strengths, improvements) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      sessionId,
      questionId,
      answerText,
      score,
      feedback,
      JSON.stringify(strengths || []),
      JSON.stringify(improvements || []),
    ]
  );

  return {
    id: result.insertId,
  };
};

const listBySession = async (sessionId) => {
  const [rows] = await pool.query(
    "SELECT question_id AS questionId, answer_text AS answerText, score, feedback, strengths, improvements FROM interview_answers WHERE session_id = ? ORDER BY created_at ASC",
    [sessionId]
  );

  return rows.map((row) => ({
    ...row,
    strengths: safeParse(row.strengths, []),
    improvements: safeParse(row.improvements, []),
  }));
};

const getLastAnswer = async (sessionId) => {
  const [rows] = await pool.query(
    "SELECT question_id AS questionId, answer_text AS answerText, score FROM interview_answers WHERE session_id = ? ORDER BY created_at DESC LIMIT 1",
    [sessionId]
  );

  return rows[0] || null;
};

module.exports = { createAnswer, listBySession, getLastAnswer };
