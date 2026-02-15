const healthService = require("../services/healthService");
const { sendSuccess } = require("../utils/response");

const getHealth = (req, res, next) => {
  try {
    const data = healthService.getHealthStatus();
    return sendSuccess(res, data);
  } catch (error) {
    return next(error);
  }
};

module.exports = { getHealth };
