const express = require("express");

const app = express();

const cors = require("cors");
app.use(cors());
require("./startup/logging")();
require("./startup/db")();
require("./startup/routes")(app);
require("./startup/config");
require("./middleware/error");
require("./startup/prod")(app);
if (process.env.NODE_ENV != "test") {
  require("./startup/port")(app);
}
module.exports = app;
