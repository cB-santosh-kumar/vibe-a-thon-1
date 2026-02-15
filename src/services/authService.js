const bcrypt = require("bcryptjs");
const AppError = require("../utils/AppError");
const { generateToken } = require("../utils/token");
const userModel = require("../models/userModel");

const signup = async ({ email, password, name }) => {
  const existing = await userModel.findByEmail(email);
  if (existing) {
    throw new AppError("Email already in use", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userModel.createUser({ email, passwordHash, name });
  const token = generateToken({ userId: user.id, email: user.email });

  return { user, token };
};

const login = async ({ email, password }) => {
  const user = await userModel.findByEmail(email);
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = generateToken({ userId: user.id, email: user.email });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name || null,
    },
    token,
  };
};

module.exports = { signup, login };
