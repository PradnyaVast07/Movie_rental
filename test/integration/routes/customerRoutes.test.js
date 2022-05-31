const supertest = require("supertest");
const app = require("../../../app");
const req = supertest(app);
const mongoose = require("mongoose");
const { Customer, validateCustomer } = require("../../../schema/customerModel");
const { User } = require("../../../schema/userModel");

describe("/api/customers", () => {
  afterEach(async () => {
    await Customer.deleteMany({});
  });
  it("Should return all the customers ", async () => {
    await Customer.collection.insertMany([
      {
        name: "Pradnya",
        phone: "1234567890",
      },
      { name: "Rohit", phone: "23456178" },
    ]);
    const res = await req.get("/api/customers");
    expect(res.status).toBe(200);
    expect(
      res.body.some((g) => {
        return g.name == "Pradnya";
      })
    ).toBeTruthy();
    expect(
      res.body.some((g) => {
        return g.name == "Rohit";
      })
    ).toBeTruthy();
  });
  it("should return 404 if genre is not found", async () => {
    const res = await req.get("/api/genres");
    //expect(res.status).toBe(404);
  });
});
describe("/Get/:id", () => {
  it("it should return 400 if object type is invalid", async () => {
    const id = "Pradnya";
    const res = await req.get("/api/genres/" + id);
    expect(res.status).toBe(400);
  });
  it("it should return 400 if id is invalid", async () => {
    const res = await req.get("/api/genres/1");
    expect(res.status).toBe(400);
  });
  it("should be return 404 if id is valid but customer is not found", async () => {
    const id = new mongoose.Types.ObjectId();
    const res = await req.get("/api/customers/" + id);
    //console.log(id);
    expect(res.status).toBe(404);
    //console.log(res.status);
  });
  it("should be return 200 when data is found", async () => {
    const customer = new Customer({
      name: "Pradnya",
      phone: "1234567890",
      isGold: "true",
    });
    await customer.save();
    const res = await req.get("/api/customers/" + customer._id);
    expect(res.status).toBe(200);
  });
  it("should be return customer if customer is found", async () => {
    const customer = new Customer({
      name: "Pradnya",
      phone: "1234567890",
      isGold: "true",
    });
    await customer.save();
    const res = await req.get("/api/customers/" + customer._id);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("name", "Pradnya");
  });

  describe("/Post", () => {
    it("It should return 401 if token is  not pass", async () => {
      //const user= new User();
      const customer = new Customer({
        name: "Pradnya",
        phone: "1234567890",
        isGold: "true",
      });
      await customer.save();
      const res = await req.post("/api/customers");
      expect(res.status).toBe(401);
      //console.log(res.status);
    });
    it("It should return 400 if token is invalid", async () => {
      const token = "AB";
      // const customer = new Customer({
      //   name: "Pradnya",
      //   phone: "1234567890",
      //   isGold: "true",
      // });

      const res = await req
        .post("/api/customers")
        .set("x-auth-token", token)
        .send({ name: "Pradnya", phone: "1234567890", isGold: "true" });
      expect(res.status).toBe(400);
    });
    it("it should return 400 when name is less than 3", async () => {
      const user = new User();
      const token = user.getAuthToken();
      const res = await req
        .post("/api/customers")
        .set("x-auth-token", token)
        .send({
          name: "pr",
          phone: "1234567890",
          isGold: "true",
        });
      expect(res.status).toBe(400);
    });
    it("it should return 400 when name is greter than 10", async () => {
      const user = new User();
      const token = user.getAuthToken();
      const res = await req
        .post("/api/customers")
        .set("x-auth-token", token)
        .send({
          name: "pradnyaBedse123",
          phone: "1234567890",
          isGold: "true",
        });
      expect(res.status).toBe(400);
    });
    it("it should be retrun 200 when data succfully save", async () => {
      const user = new User();
      const token = user.getAuthToken();
      const customer = new Customer({
        name: "pradnya",
        phone: "1234567890",
        isGold: "true",
      });
      await customer.save();
      const res = await req
        .post("/api/customers")
        .set("x-auth-token", token)
        .send({
          name: "pradnya",
          phone: "1234567890",
          isGold: "true",
        });
      expect(res.status).toBe(200);
    });
  });
  it("it should be return customer data", async () => {
    const user = new User();
    const token = user.getAuthToken();

    const res = await req
      .post("/api/customers")
      .set("x-auth-token", token)
      .send({
        name: "pradnya",
        phone: "1234567890",
        isGold: "true",
      });
    expect(res.body).toHaveProperty("name", "pradnya");
    expect(res.body).toHaveProperty("phone", "1234567890");
  });
  describe("/Put/:id", () => {
    it("it should be return 400 if object type is invalid", async () => {
      const id = "Pradnya";
      const res = await req.put("/api/customers/" + id);
      expect(res.status).toBe(400);
    });
    it("it should be return 400 if id is invalid", async () => {
      const res = await req.put("/api/customers/1");
      expect(res.status).toBe(400);
    });
    it("it should be return 401 if token is not passed", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await req.put("/api/customers/" + id);
      expect(res.status).toBe(401);
    });
    it("it should be return 400 if token is not valid", async () => {
      const token = "A";
      const id = new mongoose.Types.ObjectId();
      const res = await req
        .put("/api/customers/" + id)
        .set("x-auth-token", token);
      expect(res.status).toBe(400);
    });
    it("it should be return 400 if the name character ", async () => {
      const user = new User();
      const token = user.getAuthToken();
      const id = new mongoose.Types.ObjectId();
      const customer = new Customer({
        name: "pradnya",
        phone: "1234567890",
        isGold: "true",
      });
      await customer.save();
      const res = await req
        .put("/api/customers/" + id)
        .set("x-auth-token", token)
        .send({ name: "pa", phone: "1234567890", isGold: "true" });
      expect(res.status).toBe(400);
    });
    it("it should be return 400 if the name character is greter than 10 ", async () => {
      const user = new User();
      const token = user.getAuthToken();
      const id = new mongoose.Types.ObjectId();
      const customer = new Customer({
        name: "pradnya",
        phone: "1234567890",
        isGold: "true",
      });
      await customer.save();
      const res = await req
        .put("/api/customers/" + id)
        .set("x-auth-token", token)
        .send({ name: "pradnyaBedse", phone: "1234567890", isGold: "true" });
      expect(res.status).toBe(400);
    });
    it("should be return 200 if customer is update", async () => {
      const user = new User();
      const token = user.getAuthToken();

      const customer = new Customer({
        name: "pradnya",
        phone: "1234567890",
        isGold: "true",
      });
      await customer.save();
      const res = await req
        .put("/api/customers/" + customer._id)
        .set("x-auth-token", token)
        .send({ name: "Pallavi", phone: "1233567890", isGold: "true" });
      expect(res.status).toBe(200);
    });
  });
  // it("should be return customer update data ", async () => {
  //   const user = new User();
  //   const token = user.getAuthToken();
  //   const customer = new Customer({
  //     name: "pradnya",
  //     phone: "1234567890",
  //     isGold: "true",
  //   });
  //   await customer.save();
  //   const res = await req
  //     .put("/api/customers/", +customer._id)
  //     .set("x-auth-token", token)
  //     .send({ name: "Pallavi", phone: "1233567890", isGold: "true" });
  //   expect(res.status).toBe(200);
  //   //expect(res.body).toHaveProperty("name", "Pallavi");
  //   //console.log(res.body);
  // });
  describe("/Delete/:id", () => {
    it("It should return 400 if object type is invalid ", async () => {
      const id = "Pradnya";
      const res = await req.delete("/api/customers/" + id);
      expect(res.status).toBe(400);
    });
  });
  it("It should return 400 if id is invalid", async () => {
    const res = await req.delete("/api/customers/1");
    expect(res.status).toBe(400);
  });
  it("It should be return 401 if token is not found", async () => {
    const id = new mongoose.Types.ObjectId();
    const res = await req.delete("/api/customers/" + id);
    expect(res.status).toBe(401);
    //console.log(res.status);
  });
  it("It should return 400 if token is invalid", async () => {
    const token = "A";
    const id = new mongoose.Types.ObjectId();
    const res = await req
      .delete("/api/customers/" + id)
      .set("x-auth-token", token);
    //console.log(res.status);
    expect(res.status).toBe(400);
  });
  it("it should return 403 if isadmin:is true but  is token not found", async () => {
    const user = new User();
    const token = user.getAuthToken();
    //console.log(token);
    const id = mongoose.Types.ObjectId();
    const res = await req
      .delete("/api/customers/" + id)
      .set("x-auth-token", token);
    expect(res.status).toBe(403);
  });
  it("it should return 200 if customer succefully deleted ", async () => {
    const user = new User({
      isAdmin: "true",
    });
    const token = user.getAuthToken();
    const customer = new Customer({
      name: "Nikhil",
      phone: "1234567890",
      isGold: "true",
    });
    await customer.save();
    const res = await req
      .delete("/api/customers/" + customer._id)
      .set("x-auth-token", token);
    expect(res.status).toBe(200);
    //console.log(res.status);
  });

  it("it should send customer  back if customer successfully deleted ", async () => {
    const user = new User({
      isAdmin: "true",
    });
    const token = user.getAuthToken();
    const customer = new Customer({
      name: "Pradnya",
      phone: "1234567890",
      isGold: "true",
    });
    await customer.save();
    const res = await req
      .delete("/api/customers/" + customer._id)
      .set("x-auth-token", token);
    expect(res.body).toHaveProperty("name", "Pradnya");
    // console.log(res.status);
  });
});
