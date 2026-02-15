const jwt = require("jsonwebtoken");
const env = require("../config/env");
const AppError = require("../utils/AppError");

const authenticate = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new AppError("Unauthorized", 401));
  }

  try {
    const payload = jwt.verify(token, env.jwt.secret);
    req.user = { id: payload.userId, email: payload.email };
    return next();
  } catch (error) {
    return next(new AppError("Invalid token", 401));
  }
};

module.exports = authenticate;
