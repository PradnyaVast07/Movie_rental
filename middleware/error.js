const winston = require("winston");

module.exports = function (error, req, res, next) {
  winston.error(error.message);
  return res.status(400).send(`something failed" ${error}`);
};
