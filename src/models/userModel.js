const pool = require("../config/db");

const findByEmail = async (email) => {
  const [rows] = await pool.query(
    "SELECT id, email, password_hash AS passwordHash, name FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  return rows[0] || null;
};

const createUser = async ({ email, passwordHash, name }) => {
  const [result] = await pool.query(
    "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)",
    [email, passwordHash, name]
  );

  return {
    id: result.insertId,
    email,
    name: name || null,
  };
};

module.exports = { findByEmail, createUser };
