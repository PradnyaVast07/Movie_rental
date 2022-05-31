const express = require("express");
const { status } = require("express/lib/response");
const Router = require("router");
const router = express.Router();
const { Customer } = require("../schema/customerModel");
const { Movie } = require("../schema/movieModel");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validObjectId = require("../middleware/object");
const {
  Rental,
  rentalSchema,
  validateRental,
} = require("../schema/rentalModel");

router.get("/", async (req, res) => {
  const rental = await Rental.find();
  if (!rental) return res.status(404).send("Rental id is not found ");
  res.send(rental);
});

router.get("/count", async (req, res) => {
  const rentalsCount = await Rental.find().count();
  res.send({ rentalsCount });
});

router.post("/pfs", async (req, res) => {
  const { currentPage, pageSize } = req.body;
  let skip = (currentPage - 1) * pageSize;
  const rentals = await Rental.find().limit(pageSize).skip(skip);
  res.send(rentals);
});

router.get("/:id", validObjectId, async (req, res) => {
  const id = req.params.id;
  const rental = await Rental.findById({ _id: id });
  if (!rental) return res.status(404).res.send("rental is not found");
  res.send(rental);
});

router.post("/", async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("No movie found with give id");
  const customer = await Customer.findById(req.body.customerId);
  console.log(customer);

  if (!customer) return res.status(400).send("No customer found with give id");
  if (movie.numberInStocks == 0)
    return res.status(400).send("Movie out of stock");
  const rental = new Rental({
    customer: {
      name: customer.name,
      phone: customer.phone,
      _id: customer._id,
    },
    movie: {
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
      _id: movie._id,
    },
    rentalFee: movie.dailyRentalRate * 10,
    dateIn: req.body.dateIn,
  });
  const session = await Rental.startSession();
  session.startTransaction();
  try {
    await rental.save();
    await Movie.findByIdAndUpdate(movie._id, {
      $inc: { numberInStocks: -1 },
    });

    session.endSession();
    res.send(rental);
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    console.log(error);
    console.log(error.message);
    return res.status(500).send("something failed");
  }
});

router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const session = await Rental.startSession();
  session.startTransaction();
  try {
    const rental = await Rental.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          dateIn: req.body.dateIn,
        },
      },
      { new: true }
    );
    if (!rental) {
      return res.status(400).send("No moive found to patch");
    }
    const _id = rental.movie._id;
    console.log(_id);
    await Movie.findByIdAndUpdate(_id, {
      $inc: { numberInStocks: 1 },
    });

    session.commitTransaction();
    session.endSession();
    res.send(rental);
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    return res.status(500).send(error);
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const session = await Rental.startSession();
  session.startTransaction();
  try {
    const rental = await Rental.findByIdAndDelete(req.params.id);
    const _id = rental.movie._id;
    await Movie.findByIdAndUpdate(_id, {
      $inc: { numberInStocks: 1 },
    });

    session.commitTransaction();
    session.endSession();
    res.send(rental);
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    return res.status(500).send(error);
  }
});

module.exports = router;
