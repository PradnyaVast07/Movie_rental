const supertest = require("supertest");
const app = require("../../../app");
const req = supertest(app);
const mongoose = require("mongoose");
const { Movie } = require("../../../schema/movieModel");
const { Genre } = require("../../../schema/generModel");
const { Customer } = require("../../../schema/customerModel");
const { User } = require("../../../schema/userModel");
const { Rental } = require("../../../schema/rentalModel");

describe("/api/rentals", () => {
  afterEach(async () => {
    await Movie.deleteMany({});
    await Genre.deleteMany({});
    await Customer.deleteMany({});
    await Rental.deleteMany({});
  });
  describe("/Get", () => {
    it("should be return 404 if rental is not found ", async () => {
      const res = await req.get("/api/rental");
      //expect(res.status).toBe(404);
    });
  });
  it("should return  all the rental data ", async () => {
    const customer = new Customer({
      name: "Pradnya",
      phone: "123456789",
    });
    await customer.save();
    const genre = new Genre({
      name: "Enterain",
    });
    await genre.save();
    const movie = new Movie({
      title: "3idiot",
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStocks: "120",
      dailyRentalRate: "100",
    });
    await movie.save();
    const rental = new Rental({
      customer: {
        id: customer._id,
        name: customer.name,
        phone: customer.phone,
      },
      movie: {
        id: movie._id,
        title: movie.title,
        genre: {
          _id: genre._id,
          name: genre.name,
        },
        numberInStocks: movie.numberInStocks,
        dailyRentalRate: movie.dailyRentalRate,
      },
      rentalFee: 50,
    });
    await rental.save();
    const res = await req.get("/api/rental");
    expect(res.status).toBe(200);
  });
  describe("/Get:/id", () => {
    it("should return 400 if invalid id is passed", async () => {
      //const id = "624d4f8932de7f3189e934a7";
      const res = await req.get("/api/rental/1");
      expect(res.status).toBe(400);
    });
  });
  it("should return 400 if object type is invalid", async () => {
    const id = "Pradnya";
    const res = await req.get("/api/rental/" + id);
    //expect(res.status).toBe(400);
    //console.log(res.status);
  });
  it("should return 404 if rental is not found", async () => {
    const id = new mongoose.Types.ObjectId();
    const res = await req.get("/api/rental/" + id);
    //expect(res.status).toBe(404);
  });

  it("should return 200 when data is found ", async () => {
    const customer = new Customer({
      name: "Pradnya",
      phone: "123456789",
    });
    await customer.save();
    const genre = new Genre({
      name: "Enterain",
    });
    await genre.save();
    const movie = new Movie({
      title: "3idiot",
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStocks: "120",
      dailyRentalRate: "100",
    });
    await movie.save();
    const rental = new Rental({
      customer: {
        id: customer._id,
        name: customer.name,
        phone: customer.phone,
      },
      movie: {
        id: movie._id,
        title: movie.title,
        genre: {
          _id: genre._id,
          name: genre.name,
        },
        numberInStocks: movie.numberInStocks,
        dailyRentalRate: movie.dailyRentalRate,
      },
      rentalFee: movie.dailyRentalRate * 10,
    });

    await rental.save();
    //console.log(movie.body);

    const res = await req.get("/api/rental/" + rental._id);
    console.log(rental);
    expect(res.status).toBe(200);
  });

  describe("/post", () => {
    it("it should be return 401 if token is not  passed", async () => {
      const res = await req.post("/api/rental");
      expect(res.status).toBe(401);
    });
  });
  it("should return 400 if customer id is not given in req body", async () => {
    const user = new User();
    const token = user.getAuthToken();
    const genre = new Genre({
      name: "xyz",
    });
    await genre.save();
    const customer = new Customer({
      name: "Pradnya",
      phone: "123456789",
    });
    await customer.save();
    const movie = new Movie({
      title: "3idiot",
      numberInStocks: "120",
      dailyRentalRate: "100",

      genre: {
        _id: genre._id,
        name: genre.name,
      },
    });
    await movie.save();
    const res = await req.post("/api/rental").set("x-auth-token", token).send({
      movieId: movie._id,
    });
    expect(res.status).toBe(400);
  });
  it("should return 400 if movie id is not given in req body", async () => {
    const user = new User();
    const token = user.getAuthToken();
    const genre = new Genre({
      name: "xyz",
    });
    await genre.save();
    const customer = new Customer({
      name: "Pradnya",
      phone: "123456789",
    });
    await customer.save();
    const movie = new Movie({
      title: "3idiot",
      numberInStocks: "120",
      dailyRentalRate: "100",

      genre: {
        _id: genre._id,
        name: genre.name,
      },
    });
    await movie.save();
    const res = await req.post("/api/rental").set("x-auth-token", token).send({
      customerId: customer._id,
    });
    expect(res.status).toBe(400);
  });

  it("should return 400 if number in stocks is 0 is in req body", async () => {
    const user = new User();
    const token = user.getAuthToken();
    const genre = new Genre({
      name: "xyz",
    });
    await genre.save();
    const customer = new Customer({
      name: "Pradnya",
      phone: "123456789",
    });
    await customer.save();
    const movie = new Movie({
      title: "3idiot",
      numberInStocks: 0,
      dailyRentalRate: "100",

      genre: {
        _id: genre._id,
        name: genre.name,
      },
    });
    await movie.save();
    const res = await req.post("/api/rental").set("x-auth-token", token).send({
      customerId: customer._id,
      movieId: movie._id,
    });
    expect(res.status).toBe(400);
  });

  it("should return 200 when data is saved ", async () => {
    const user = new User();
    const token = user.getAuthToken();
    const customer = new Customer({
      name: "Pradnya",
      phone: "123456789",
    });
    await customer.save();
    const genre = new Genre({
      name: "Enterain",
    });
    await genre.save();
    const movie = new Movie({
      title: "3idiot",
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStocks: "120",
      dailyRentalRate: "100",
    });
    await movie.save();
    // const rental = new Rental({
    //   customer: {
    //     id: customer._id,
    //     name: customer.name,
    //     phone: customer.phone,
    //   },
    //   movie: {
    //     id: movie._id,
    //     title: movie.title,
    //     genre: {
    //       id: genre._id,
    //       name: genre.name,
    //     },
    //     numberInStocks: movie.numberInStocks,
    //     dailyRentalRate: movie.dailyRentalRate,
    //   },
    //   rentalFee: movie.dailyRentalRate * 10,
    // });
    //await rental.save();
    //console.log(movie.body);
    const res = await req
      .get("/api/rental")
      .set("x-auth-token", token)
      .send({ movieId: movie._id, customerId: customer._id });
    expect(res.status).toBe(200);
    const rental = await Rental.findOne({ "movie.title": "3idiot" });
    //expect(rental).not.toBeNull();
    //expect(rental).toHaveProperty("rentalFee", 11);
  });

  describe("/patch/:id", () => {
    it("it should be return 400 if object type is invalid", async () => {
      const id = "Pradnya";
      const res = await req.patch("/api/rental/" + id);
      expect(res.status).toBe(400);
    });
  });
  it("it should be return 400 if id is invalid", async () => {
    const res = await req.patch("/api/rental/1");
    expect(res.status).toBe(400);
  });
  it("it should be return 401 if token is not passed", async () => {
    const id = new mongoose.Types.ObjectId();
    const res = await req.patch("/api/rental/" + id);
    expect(res.status).toBe(401);
  });
});
it("it should be return 400 if token is not valid", async () => {
  const token = "A";
  const id = new mongoose.Types.ObjectId();
  const res = await req.patch("/api/rental/" + id).set("x-auth-token", token);
  expect(res.status).toBe(400);
});
it("should update rental if data is valid", async () => {
  const user = new User();
  const token = user.getAuthToken();
  const genre = new Genre({
    name: "Drama",
  });
  await genre.save();
  const customer = new Customer({
    name: "Pallavi",
    phone: "123456789",
  });
  await customer.save();

  const movie = new Movie({
    title: "Queen",
    dailyRentalRate: 100,
    numberInStocks: 10,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
  });
  await genre.save();
  const rental = new Rental({
    customer: {
      name: customer.name,
      _id: customer.id,
      phone: customer.phone,
    },
    movie: {
      _id: movie.id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
      numberInStocks: movie.numberInStocks,
    },
    rentalFee: 50,
  });
  await rental.save();
});
