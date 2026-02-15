const pool = require("../config/db");

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
};

const upsertReport = async ({
  sessionId,
  overallScore10,
  overallScore100,
  strengths,
  improvementAreas,
  improvedAnswers,
  nextTopics,
}) => {
  await pool.query(
    "INSERT INTO interview_reports (session_id, overall_score_10, overall_score_100, strengths, improvement_areas, improved_answers, next_topics) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE overall_score_10 = VALUES(overall_score_10), overall_score_100 = VALUES(overall_score_100), strengths = VALUES(strengths), improvement_areas = VALUES(improvement_areas), improved_answers = VALUES(improved_answers), next_topics = VALUES(next_topics)",
    [
      sessionId,
      overallScore10,
      overallScore100,
      JSON.stringify(strengths || []),
      JSON.stringify(improvementAreas || []),
      JSON.stringify(improvedAnswers || []),
      JSON.stringify(nextTopics || []),
    ],
  );
};

const getBySession = async (sessionId) => {
  const [rows] = await pool.query(
    "SELECT overall_score_10 AS overallScore10, overall_score_100 AS overallScore100, strengths, improvement_areas AS improvementAreas, improved_answers AS improvedAnswers, next_topics AS nextTopics FROM interview_reports WHERE session_id = ? LIMIT 1",
    [sessionId],
  );

  const report = rows[0];
  if (!report) {
    return null;
  }

  return {
    ...report,
    strengths: safeParse(report.strengths, []),
    improvementAreas: safeParse(report.improvementAreas, []),
    improvedAnswers: safeParse(report.improvedAnswers, []),
    nextTopics: safeParse(report.nextTopics, []),
  };
};

module.exports = { upsertReport, getBySession };
