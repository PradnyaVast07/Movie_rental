const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 10,
    trim: true,
  },
});

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(10).required(),

    _id: Joi.objectId(),
  });
  return schema.validate(genre);
}

const Genre = new mongoose.model("Genre", genreSchema);
module.exports.Genre = Genre;
module.exports.validateGenre = validateGenre;
module.exports.genreSchema = genreSchema;
