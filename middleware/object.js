const mongoose = require("mongoose");
module.exports = function (req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).send("Invalid object id");
    next();
  } catch (error) {
    return res.status(400).send("Invalid admin");
  }
};
