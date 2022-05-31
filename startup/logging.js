require("express-async-errors");
const winston = require("winston");

module.exports = function () {
  winston.configure({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: "logFile.log" }),
    ],
  });

  process.on("unhandleRejection", function (ex) {
    winston.error("we have got an unhandled rejection" + ex.message);
    process.exit(1);
  });

  process.on("uncaughtException", function (ex) {
    winston.error("we got an uncaught Exception" + ex.message);
    process.exit(1);
  });
};
