const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { User, validateUser } = require("../schema/userModel");
const _ = require("lodash");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validObjectId = require("../middleware/object");

router.get("/", async (req, res) => {
  const user = await User.find({});
  res.send(user);
});

router.get("/:id", validObjectId, async (req, res) => {
  const id = req.params.id;
  const user = await User.findByIdAndUpdate({ _id: id });
  if (!user) return res.status(400).send("User Id is not found");
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  console.log("Ok");
  let user = await User.findOne({ email: req.body.email });

  if (user) {
    return res.status(404).send("Invalid username or password");
  }

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    isAdmin: req.body.isAdmin,
  });
  const salt = await bcrypt.genSalt(10);

  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  res.send(user);
  res.send(_.pick(user, ["name", "email", "isAdmin"]));
});

router.put("/:id", validObjectId, auth, admin, async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(
    req.params.id,

    {
      $set: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      },
    },
    { new: true }
  );

  if (user) {
    res.send(user);
  } else {
    console.log("user is not found");
  }
});

router.delete("/:id", validObjectId, auth, admin, async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    res.send("user not found");
  }
  res.send(user);
});

module.exports = router;
