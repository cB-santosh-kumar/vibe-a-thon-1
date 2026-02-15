const authService = require("../services/authService");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");

const signup = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body || {};

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const result = await authService.signup({ email, password, name });
  return sendSuccess(res, result, 201);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const result = await authService.login({ email, password });
  return sendSuccess(res, result);
});

module.exports = { signup, login };
