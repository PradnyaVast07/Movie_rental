const express = require("express");
const { Genre } = require("../schema/generModel");
const router = express.Router();
const { Movie, validatemovie } = require("../schema/movieModel");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validObjectId = require("../middleware/object");

router.get("/", async (req, res) => {
  const movies = await Movie.find();
  if (movies.length == 0) return res.send(404).send("Movies no found");
  res.send(movies);
});
router.get("/count", async (req, res) => {
  console.log("start");
  const genreName = req.query.genreName;
  const title = req.query.title;
  let query = {};
  if (genreName) {
    query["genre.name"] = genreName;
  }
  if (title) {
    query["title"] = new RegExp(title, "i");
  }
  console.log("end");
  const moviesCount = await Movie.find(query).count();
  res.send({ moviesCount });
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const movie = await Movie.findById(id);
  if (!movie) return res.status(404).send("Movie id not found");
  res.send(movie);
});

router.post("/", auth, async (req, res) => {
  const { error } = validatemovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("No genre found with give id");
  const movie = new Movie({
    title: req.body.title,
    genre: {
      name: genre.name,
      _id: genre._id,
    },
    dailyRentalRate: req.body.dailyRentalRate,
    numberInStocks: req.body.numberInStocks,
    liked: req.body.liked,
  });
  await movie.save();
  res.send(movie);
});

router.post("/pfs", async (req, res) => {
  const { currentPage, pageSize, genreName, title, sortColumn } = req.body;
  let skip = (currentPage - 1) * pageSize;
  let query = {};
  if (genreName) {
    query["genre.name"] = genreName;
  }
  if (title) {
    query["title"] = new RegExp(title, "i");
  }
  let sort = {};
  if (sortColumn) {
    const { path, order } = sortColumn;
    sort[path] = order;
  }

  const movies = await Movie.find(query).limit(pageSize).skip(skip).sort(sort);
  res.status(200).send(movies);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validatemovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("No genre found with give id");
  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title: req.body.title,
        genre: {
          name: genre.name,
          _id: genre._id,
        },
        dailyRentalRate: req.body.dailyRentalRate,
        numberInStocks: req.body.numberInStocks,
        liked: req.body.liked,
      },
    },
    { new: true }
  );
  if (movie) {
    res.status(200).send(movie);
  } else {
    console.log("movie is not found");
  }
});

router.delete("/:id", auth, async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) {
    return res.status(400).send("movie is not found to delete");
  }
  res.send(movie);
});

module.exports = router;
