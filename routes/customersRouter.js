const express = require("express");
const { Customer, validateCustomer } = require("../schema/customerModel");
const router = new express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validObjectId = require("../middleware/object");

router.get("/", async (req, res) => {
  const customer = await Customer.find({});
  if (customer.length == 0) return res.status("404").send("No data found");
  res.send(customer);
});

router.get("/count", async (req, res) => {
  const customersCount = await Customer.find().count();
  res.send({ customersCount });
});

router.get("/:id", validObjectId, async (req, res) => {
  const id = req.params.id;
  const customer = await Customer.findById(id);
  if (!customer) res.status(404).send("customerId is not found");
  res.send(customer);
});

router.post("/", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) throw error.details[0].message;
  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });
  console.log(req.body);
  await customer.save();
  res.send(customer);
});

router.post("/pfs", async (req, res) => {
  const { currentPage, pageSize } = req.body;
  let skip = (currentPage - 1) * pageSize;
  const getCustomers = await Customer.find({}).limit(pageSize).skip(skip);
  res.send(getCustomers);
});

router.put("/:id", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) throw error.details[0].message;
  const customer = await Customer.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold,
      },
    }
  );

  if (customer) {
    res.status(200).send(customer);
  } else {
    //console.log("customer is not found");
    res.status(404).send("customer is not found");
  }
});

router.delete("/:id", auth, async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) return res.status(400).send("Id not found");
  res.send(customer);
});

module.exports = router;
