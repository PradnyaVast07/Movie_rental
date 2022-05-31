const supertest = require("supertest");
const app = require("../../../app");
const req = supertest(app);
const mongoose = require("mongoose");
const { Movie } = require("../../../schema/movieModel");
const { Genre, genreSchema } = require("../../../schema/generModel");
const { User } = require("../../../schema/userModel");

describe("/api/movies", () => {
  afterEach(async () => {
    await Movie.deleteMany({});
    await Genre.deleteMany({});
  });

  describe("/Get", () => {
    it("should be return 404 if movie is not found", async () => {
      const res = await req.get("/api/movies");
      //console.log("response", res.body);
      //expect(res.status).toBe(404);
      //console.log(res.status);
    });
    it("should be return  all the movie data", async () => {
      const genre = new Genre({
        name: "comedy",
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
      const res = await req.get("/api/movies");
      expect(res.status).toBe(200);
      //   //   expect(
      //   //     res.body.some((g) => {
      //   //       return g.title == "3idiot";
      //   //     })
      //   //   ).toBeTruthy();
    });
  });
  describe("/Get:/id", () => {
    it("should return 400 if invalid id is passed", async () => {
      //const id = "624d4f8932de7f3189e934a7";
      const res = await req.get("/api/movies/1");
      expect(res.status).toBe(400);
    });
  });
  it("should return 400 if object type is invalid", async () => {
    const id = "Pradnya";
    const res = await req.get("/api/movies/" + id);
    expect(res.status).toBe(400);
    //console.log(res.status);
  });
  it("should return 404 if movie is not found", async () => {
    const id = new mongoose.Types.ObjectId();
    const res = await req.get("/api/movies/" + id);
    expect(res.status).toBe(404);
  });
  it("should be return 200 when data is found", async () => {
    const genre = new Genre({
      name: "comdey",
    });
    await genre.save;
    const movie = new Movie({
      title: "Golmaal",
      genre: {
        id: genre._id,
        name: genre.name,
      },
      numberInStocks: "120",
      dailyRentalRate: "100",
    });
    await movie.save();
    const res = await req.get("/api/movies/", +movie._id);
    expect(res.status).toBe(200);
    //console.log(res.status);
    //console.log(res.body);
  });

  it("should be return movie data is found", async () => {
    const genre = new Genre({
      name: "comdey",
    });
    await genre.save;
    const movie = new Movie({
      title: "Golmaal",
      genre: {
        id: genre._id,
        name: genre.name,
      },
      numberInStocks: "120",
      dailyRentalRate: "100",
    });
    await movie.save();
    const res = await req.get("/api/movies/", +movie._id);
    expect(res.status).toBe(200);
    //console.log(res.body);
    expect(res.body[0]).toHaveProperty("_id", movie._id.toHexString());
    // expect(res.body).toHaveProperty("title", movie.title);
  });

  //   describe("/Post", () => {
  //     it("it should be return 401 if token is passed", async () => {
  //       const res = await req.post("/api/movies");
  //       expect(res.status).toBe(401);
  //     });
  //   });
  //   it("should return 400 if numberInStocks is less than 0 number", async () => {
  //     const user = new User();
  //     const token = user.getAuthToken();
  //     const genre = new Genre({
  //       name: "comedy",
  //     });
  //     const movie = new Movie({
  //       title: "Golmaal",
  //       genre: {
  //         id: genre._id,
  //         name: genre.name,
  //       },
  //       numberInStocks: -1,
  //       dailyRentalRate: 100,
  //     });

  //     const res = await req
  //       .post("/api/movies")
  //       .set("x-auth-token", token)
  //       .send(movie);
  //     expect(res.status).toBe(400);
  //   });

  //   it("should return 400 genre required field is not given in req body", async () => {
  //     const user = new User();
  //     const token = user.getAuthToken();
  //     const movie = new Movie({
  //       title: "Golmaal",
  //       numberInStocks: -1,
  //       dailyRentalRate: 100,
  //     });
  //     const res = await req
  //       .post("/api/movies")
  //       .set("x-auth-token", token)
  //       .send(movie);
  //     expect(res.status).toBe(400);
  //   });

  //   it("should return 400 if title  more than 10 char", async () => {
  //     const user = new User();
  //     const token = user.getAuthToken();
  //     const genre = new Genre({
  //       name: "comedy",
  //     });
  //     const movie = new Movie({
  //       title: "Golmaalagain",
  //       genre: {
  //         id: genre._id,
  //         name: genre.name,
  //       },
  //       numberInStocks: -1,
  //       dailyRentalRate: 100,
  //     });

  //     const res = await req
  //       .post("/api/movies")
  //       .set("x-auth-token", token)
  //       .send(movie);
  //     expect(res.status).toBe(400);
  //   });
  //   it("should be return 200 if the data is saved successfully", async () => {
  //     const user = new User();
  //     const token = user.getAuthToken();
  //     const genre = new Genre({
  //       name: "action",
  //     });
  //     await genre.save();
  //     const movie = await req
  //       .post("/api/movies")
  //       .set("x-auth-token", token)
  //       .send({
  //         title: "Attack",
  //         genreId: genre._id,
  //         numberInStocks: 100,
  //         dailyRentalRate: 100,
  //       });

  //     const res = await req
  //       .put("/api/movies/" + movie.body._id)
  //       .set("x-auth-token", token)
  //       .send({
  //         title: "Jersey",
  //         genreId: genre._id,
  //         numberInStocks: 100,
  //         dailyRentalRate: 100,
  //       });

  //     //console.log(res.body);
  //     expect(res.status).toBe(200);
  //   });
  //   it("should be return 200 if the movie  is return  successfully", async () => {
  //     const user = new User();
  //     const token = user.getAuthToken();
  //     const genre = new Genre({
  //       name: "action",
  //     });
  //     await genre.save();
  //     const movie = await req
  //       .post("/api/movies")
  //       .set("x-auth-token", token)
  //       .send({
  //         title: "Attack",
  //         genreId: genre._id,
  //         numberInStocks: 100,
  //         dailyRentalRate: 100,
  //       });

  //     const res = await req
  //       .put("/api/movies/" + movie.body._id)
  //       .set("x-auth-token", token)
  //       .send({
  //         title: "Jersey",
  //         genreId: genre._id,
  //         numberInStocks: 100,
  //         dailyRentalRate: 100,
  //       });
  //     expect(res.status).toBe(200);
  //     expect(res.body).toHaveProperty("title", "Jersey");
  //   });
  // });
  // describe("/Delete/:id", () => {
  //   it("It should return 400 if object type is invalid ", async () => {
  //     const id = "Pradnya";
  //     const res = await req.delete("/api/movies/" + id);
  //     expect(res.status).toBe(400);
  //   });
  //   it("It should return 400 if id is invalid", async () => {
  //     const res = await req.delete("/api/movies/1");
  //     expect(res.status).toBe(400);
  //   });
  //   it("It should be return 401 if token is not found", async () => {
  //     const id = new mongoose.Types.ObjectId();
  //     const res = await req.delete("/api/movies/" + id);
  //     expect(res.status).toBe(401);
  //     //console.log(res.status);
  //   });
  //   it("It should return 400 if token is invalid", async () => {
  //     const token = "A";
  //     const id = new mongoose.Types.ObjectId();
  //     const res = await req
  //       .delete("/api/movies/" + id)
  //       .set("x-auth-token", token);
  //     //console.log(res.status);
  //     expect(res.status).toBe(400);
  //   });
  //   it("it should return 403 if isadmin:is true but token is not found", async () => {
  //     const user = new User();
  //     const token = user.getAuthToken();
  //     //console.log(token);
  //     const id = mongoose.Types.ObjectId();
  //     const res = await req
  //       .delete("/api/movies/" + id)
  //       .set("x-auth-token", token);
  //     expect(res.status).toBe(403);
  //   });
  //   it("it should return 200 if customer succefully deleted ", async () => {
  //     const user = new User({
  //       isAdmin: "true",
  //     });

  //     const token = user.getAuthToken();
  //     const genre = new Genre({
  //       name: "action",
  //     });
  //     await genre.save();
  //     const movie = await req
  //       .post("/api/movies")
  //       .set("x-auth-token", token)
  //       .send({
  //         title: "Attack",
  //         genreId: genre._id,
  //         numberInStocks: 100,
  //         dailyRentalRate: 100,
  //       });
  //     const res = await req
  //       .delete("/api/movies/" + movie.body._id)
  //       .set("x-auth-token", token);
  //     expect(res.status).toBe(200);
  //     //console.log(res.status);
  //   });
  //   it("it should send movie  back if movie successfully deleted ", async () => {
  //     const user = new User({
  //       isAdmin: "true",
  //     });
  //     const token = user.getAuthToken();
  //     const genre = new Genre({
  //       name: "Suspense",
  //     });
  //     await genre.save();
  //     const movie = await req
  //       .post("/api/movies")
  //       .set("x-auth-token", token)
  //       .send({
  //         title: "Attack",
  //         genreId: genre._id,
  //         numberInStocks: 100,
  //         dailyRentalRate: 100,
  //       });
  //     const res = await req
  //       .delete("/api/movies/" + movie.body._id)
  //       .set("x-auth-token", token);
  //     expect(res.status).toBe(200);
  //     expect(res.body).toHaveProperty("title", "Attack");
  //   });
});
