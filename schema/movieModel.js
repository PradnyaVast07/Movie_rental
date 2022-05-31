//const express = require("express");
const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { genreSchema } = require("../schema/generModel");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 3,
    maxlength: 10,
    required: true,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  dailyRentalRate: {
    type: Number,
    minlength: 0,
    maxlength: 2000,
    required: true,
  },
  numberInStocks: {
    type: Number,
    minlength: 0,
    maxlength: 255,
    required: true,
  },
  liked: {
    type: Boolean,
    default: false,
  },
});
const Movie = mongoose.model("Movie", movieSchema);

function validatemovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(10).required(),
    genreId: Joi.objectId().required(),
    dailyRentalRate: Joi.number().min(0).max(2000).required(),
    numberInStocks: Joi.number().min(0).max(255).required(),
    liked: Joi.boolean().required(),
  });
  return schema.validate(movie);
}
module.exports.Movie = Movie;
module.exports.movieSchema = movieSchema;
module.exports.validatemovie = validatemovie;
