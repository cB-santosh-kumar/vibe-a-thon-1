const healthModel = require("../models/healthModel");

const getHealthStatus = () => {
  return healthModel.buildStatus();
};

module.exports = { getHealthStatus };
