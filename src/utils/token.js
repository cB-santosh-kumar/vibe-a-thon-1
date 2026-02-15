const jwt = require("jsonwebtoken");
const env = require("../config/env");

const generateToken = (payload) => {
  return jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn });
};

module.exports = { generateToken };
