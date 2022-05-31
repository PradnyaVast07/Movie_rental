const supertest = require("supertest");
const app = require("../../../app");
const mongoose = require("mongoose");
const req = supertest(app);
const { Genre, validateGenre } = require("../../../schema/generModel");
const { User } = require("../../../schema/userModel");

describe("/api/genres", () => {
  afterEach(async () => {
    await Genre.deleteMany({});
  });
  describe("GET/", () => {
    it("Should return all the genre ", async () => {
      await Genre.collection.insertMany([
        {
          name: "genre1",
        },
        { name: "genre2" },
      ]);
      const res = await req.get("/api/genres");
      expect(res.status).toBe(200);
    });
  });
  it("should return 404 if genre is not found", async () => {
    const res = await req.get("/api/genres");
    //expect(res.status).toBe(404);
    //console.log(res.status);
  });

  // describe("/GET/:id", () => {
  //   it("should return 400 if invalid id is passed", async () => {
  //     const res = await req.get("/api/genres/1");
  //     expect(res.status).toBe(400);
  //   });
  //   it("should return 400 if object type is passes", async () => {
  //     const id = new mongoose.Types.ObjectId();
  //     const res = await req.get("/api/genres/" + id);
  //     expect(res.status).toBe(404);
  //     //console.log(res.status);
  //   });
  // });
  // it("should return 404 if genre is not found", async () => {
  //   const res = await req.get("/api/genres");
  //   expect(res.status).toBe(404);
  // });
  // it("should return 200 when data is found", async () => {
  //   const genre = new Genre({
  //     name: "genre1",
  //   });
  //   await genre.save();
  //   const res = await req.get("/api/genres/" + genre._id);
  //   expect(res.status).toBe(200);
  //   //console.log(res.status);
  //   expect(res.body).toHaveProperty("_id", genre._id.toHexString());
  //   expect(res.body).toHaveProperty("name", genre.name);
  // });

  // describe("POST/", () => {
  //   it("it should be return 401 if token is not passed", async () => {
  //     const res = await req.post("/api/genres/");
  //     expect(res.status).toBe(401);
  //   });
  // });
  // it("it should return 400 if token is invalid", async () => {
  //   const token = "Pradnya bedse";
  //   //console.log(token);
  //   const res = await req.post("/api/genres").set("x-auth-token", token).send({
  //     name: "comedy",
  //   });
  //   expect(res.status).toBe(400);
  // });
  // it("it should return the 400 if genre name character is less than 2 ", async () => {
  //   const user = new User();
  //   const token = user.getAuthToken();
  //   const res = await req.post("/api/genres").set("x-auth-token", token).send({
  //     name: "pr",
  //   });
  //   expect(res.status).toBe(400);
  // });
  // it("it should return the 400 if genre name character is greter than 10", async () => {
  //   const user = new User();
  //   const token = user.getAuthToken();
  //   const res = await req.post("/api/genres").set("x-auth-token", token).send({
  //     name: "pradnyabedse",
  //   });
  //   expect(res.status).toBe(400);
  // });
  // it("should return 200 when genre is found", async () => {
  //   const user = new User();
  //   const token = user.getAuthToken();
  //   const res = await req.post("/api/genres").set("x-auth-token", token).send({
  //     name: "comedy",
  //   });
  //   expect(res.status).toBe(200);
  //   //console.log(res.body);
  //   const genre = await Genre.findOne({ name: "comedy" });
  //   expect(genre).not.toBeNull();
  //   expect(genre).toHaveProperty("name", "comedy");
  // });
  // it("it should return the genre", async () => {
  //   const user = new User();
  //   const token = user.getAuthToken();
  //   const res = await req.post("/api/genres").set("x-auth-token", token).send({
  //     name: "comedy",
  //   });
  //   expect(res.status).toBe(200);
  //   expect(res.body).toHaveProperty("name", "comedy");
  // });

  // describe("/Put/:id", () => {
  //   it("it should return 400 if id is invalid", async () => {
  //     const res = await req.put("/api/genres/1");
  //     console.log(res.status);
  //     //expect(res.send).toBe(400);
  //   });
  //   it("it should return 400 if object type is invalid", async () => {
  //     const id = "Pradnya";
  //     const res = await req.put("/api/genres/" + id);
  //     expect(res.status).toBe(400);
  //     //console.log(res.status);
  //   });
  // });
  // it("It should return 400 if token not valid ", async () => {
  //   const token = "A";
  //   const id = new mongoose.Types.ObjectId();
  //   const res = await req.put("/api/genres/" + id).set("x-auth-token", token);
  //   expect(res.status).toBe(400);
  //   //console.log(res.status);
  // });
  // it("It should return 401 if token is not found", async () => {
  //   const res = await req.put("/api/genres/624c5e66612a2d5816c500f9");
  //   expect(res.status).toBe(401);
  // });
  // it("it should return 400 if data is less than 3 character ", async () => {
  //   const user = new User();
  //   const token = user.getAuthToken();
  //   const genre = new Genre({
  //     name: "pradnya",
  //   });
  //   await genre.save();
  //   const res = await req
  //     .put("/api/genres/" + genre._id)
  //     .set("x-auth-token", token)
  //     .send({
  //       name: "Ra",
  //     });
  //   //console.log(res.status);
  //   expect(res.status).toBe(400);
  // });
  // it("it should return 400 if data is greter than 10 character ", async () => {
  //   const user = new User();
  //   const token = user.getAuthToken();
  //   const genre = new Genre({
  //     name: "pradnya",
  //   });
  //   await genre.save();
  //   const res = await req
  //     .put("/api/genres/" + genre._id)
  //     .set("x-auth-token", token)
  //     .send({
  //       name: "RajshreeNair",
  //     });
  //   //console.log(res.status);
  //   expect(res.status).toBe(400);
  // });
  // it("should return 404 if valid is found but genre is not found ", async () => {
  //   const user = new User();
  //   const token = user.getAuthToken();
  //   const id = "623d7b18547514ec2eaa7e8d";
  //   const res = await req
  //     .put("/api/genres", +id)
  //     .set("x-auth-token", token)
  //     .send({
  //       name: "Thriller",
  //     });
  //   //console.log(res.status);
  //   expect(res.status).toBe(404);
  // });
  // it("should be return 200 when succefully data is change", async () => {
  //   const user = new User();
  //   const token = user.getAuthToken();
  //   const genre = new Genre({
  //     name: "comdey",
  //   });
  //   await genre.save();
  //   const res = await req
  //     .put("/api/genres/" + genre._id)
  //     .set("x-auth-token", token)
  //     .send({
  //       name: "Thriller",
  //     });
  //   //console.log(res.status);
  //   expect(res.status).toBe(200);
  // });
  // it("should be return put genre data", async () => {
  //   const user = new User();
  //   const token = user.getAuthToken();
  //   const genre = new Genre({
  //     name: "Action",
  //   });
  //   await genre.save();
  //   const res = await req
  //     .put("/api/genres/" + genre._id)
  //     .set("x-auth-token", token)
  //     .send({
  //       name: "Thriller",
  //     });
  //   expect(res.status).toBe(200);
  // });
  // describe("/Delete/:id", () => {
  //   it("It should return 400 if object type is invalid ", async () => {
  //     const id = "Pradnya";
  //     const res = await req.delete("/api/genres/" + id);
  //     expect(res.status).toBe(400);
  //   });
  //   it("It should return 400 if id is invalid", async () => {
  //     const res = await req.delete("/api/genres/1");
  //     expect(res.status).toBe(400);
  //   });

  //   it("It should be return 401 if token is not found", async () => {
  //     const id = new mongoose.Types.ObjectId();
  //     const res = await req.delete("/api/genres/" + id);
  //     expect(res.status).toBe(401);
  //     //console.log(res.status);
  //   });
  //   it("It should return 400 if token is invalid", async () => {
  //     const token = "A";
  //     const id = new mongoose.Types.ObjectId();
  //     const res = await req
  //       .delete("/api/genres/" + id)
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
  //       .delete("/api/genres/" + id)
  //       .set("x-auth-token", token);
  //     expect(res.status).toBe(403);
  //   });
  //   it("it should return 200 if genre succefully deleted ", async () => {
  //     const user = new User({
  //       isAdmin: "true",
  //     });

  //     const token = user.getAuthToken();
  //     const genre = new Genre({
  //       name: "comdey",
  //     });
  //     await genre.save();
  //     const res = await req
  //       .delete("/api/genres/" + genre._id)
  //       .set("x-auth-token", token);
  //     expect(res.status).toBe(200);
  //     //console.log(res.status);
  //   });
  // });
  // it("it should send genre back if genre gets successfully deleted ", async () => {
  //   const user = new User({
  //     isAdmin: "true",
  //   });

  //   const token = user.getAuthToken();
  //   const genre = new Genre({
  //     name: "comdey",
  //   });
  //   await genre.save();
  //   const res = await req
  //     .delete("/api/genres/" + genre._id)
  //     .set("x-auth-token", token);
  //   expect(res.body).toHaveProperty("name", "comdey");
  //   // console.log(res.status);
  // });
});
