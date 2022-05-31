const routerGenre = require("../routes/genreRouter");
const routerCustomer = require("../routes/customersRouter");
const routerMovie = require("../routes/movieRouter");
const routerRental = require("../routes/rentalRouter");
const routerUser = require("../routes/userRouter");
const routerLogin = require("../routes/loginRouter");
const error = require("../middleware/error");
const express = require("express");
const app = express();

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/genres", routerGenre);
  app.use("/api/customers", routerCustomer);
  app.use("/api/movies", routerMovie);
  app.use("/api/rentals", routerRental);
  app.use("/api/user", routerUser);
  app.use("/api/login", routerLogin);
  app.use(error);
};
