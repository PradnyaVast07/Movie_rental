const mongoose = require("mongoose");
const config = require("config");
const db = config.get("url");

module.exports = function () {
  mongoose.connect(config.get("url")).then(() => {
    console.log(`connection successful to  ${config.get("url")}`);
  });
};
