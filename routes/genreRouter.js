const express = require("express");
const router = new express.Router();
const { Genre, validateGenre } = require("../schema/generModel");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validObjectId = require("../middleware/object");

router.get("/", async (req, res) => {
  const genre = await Genre.find({});
  console.log(genre);
  console.log(genre.length);
  if (genre && genre.length === 0) {
    return res.status(404).send("Genres not found");
  }
  res.status(200).send(genre);
  res.send(genre);
});

router.get("/:count", async (req, res) => {
  const genresCount = await Genre.find().count();
  res.send({ genresCount });
});
router.get("/:id", validObjectId, async (req, res) => {
  const id = req.params.id;
  const genre = await Genre.findById({ _id: id });
  if (!genre) return res.status(404).send("Genre is not found");
  res.send(genre);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) throw error.details[0].message;
  const genre = new Genre({ name: req.body.name });
  await genre.save();

  res.send(genre);
});

router.post("/pfs", async (req, res) => {
  const { currentPage, pageSize } = req.body;
  let skip;
  if (currentPage > 0) {
    skip = (currentPage - 1) * pageSize;
  }

  let query = {};
  const genresCount = await Genre.find(query).limit(pageSize).skip(skip);
  res.send(genresCount);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) throw error.details[0].message;
  const genre = await Genre.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: { name: req.body.name } }
  );
  if (genre) {
    res.status(200).send(genre);
  } else {
    req.status(404).send("Genre id is not found");
  }
});

router.delete("/:id", auth, async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);

  if (!genre) {
    return req.status(404).send("genre is not found");
  }
  res.send(genre);
});

module.exports = router;
