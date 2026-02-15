const env = require("../config/env");

const callOllama = async (prompt) => {
  const response = await fetch(`${env.ollama.baseUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: env.ollama.model,
      prompt,
      stream: false,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Ollama error: ${response.status} ${text}`);
  }

  const text = await response.text();
  try {
    const data = JSON.parse(text);
    return data.response || "";
  } catch (error) {
    throw new Error(`Ollama error: invalid JSON response: ${text.slice(0, 200)}`);
  }
};

const safeJsonParse = (text, fallback) => {
  try {
    return JSON.parse(text);
  } catch (error) {
    return fallback;
  }
};

const generateQuestion = async ({ role, difficulty, interviewType, followup, lastAnswer, lastQuestion }) => {
  const followupNote = followup
    ? "Generate a follow-up question based on the last answer and last question."
    : "Generate a new primary question.";

  const prompt = [
    "You are an interview question generator for technical roles.",
    `Role: ${role}. Difficulty: ${difficulty}. Interview type: ${interviewType}.`,
    followupNote,
    lastQuestion ? `Last question: ${lastQuestion}` : "",
    lastAnswer ? `Last answer: ${lastAnswer}` : "",
    "Return ONLY valid JSON with keys: question, difficulty, isFollowup.",
  ]
    .filter(Boolean)
    .join("\n");

  const responseText = await callOllama(prompt);
  return safeJsonParse(responseText, {
    question: "Tell me about your recent project and the tradeoffs you made.",
    difficulty,
    isFollowup: !!followup,
  });
};

const evaluateAnswer = async ({ role, difficulty, question, answer }) => {
  const prompt = [
    "You are an expert technical interviewer scoring answers from 0 to 10.",
    `Role: ${role}. Difficulty: ${difficulty}.`,
    `Question: ${question}`,
    `Answer: ${answer}`,
    "Return ONLY valid JSON with keys: score, strengths (array), improvements (array), feedback.",
  ].join("\n");

  const responseText = await callOllama(prompt);
  return safeJsonParse(responseText, {
    score: 5,
    strengths: ["Communicates clearly"],
    improvements: ["Provide more concrete examples"],
    feedback: "Solid start. Add specifics and tradeoffs.",
  });
};

const generateReport = async ({ role, difficulty, answers }) => {
  const prompt = [
    "You are an interview coach producing a structured performance report.",
    `Role: ${role}. Difficulty: ${difficulty}.`,
    "Answers summary:",
    JSON.stringify(answers),
    "Return ONLY valid JSON with keys: overallScore10, overallScore100, strengths (array), improvementAreas (array), improvedSampleAnswers (array), nextTopics (array).",
  ].join("\n");

  const responseText = await callOllama(prompt);
  return safeJsonParse(responseText, {
    overallScore10: 6.5,
    overallScore100: 65,
    strengths: ["Structured thinking", "Clear communication", "Basic correctness"],
    improvementAreas: ["Depth of examples", "Edge cases", "Performance tradeoffs"],
    improvedSampleAnswers: ["Add a more detailed example for the last question."],
    nextTopics: ["System design fundamentals", "Behavioral STAR method"],
  });
};

module.exports = { generateQuestion, evaluateAnswer, generateReport };
