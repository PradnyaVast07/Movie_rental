const mongoose = require("mongoose");
const Joi = require("joi");

const customersSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 10,
    required: true,
  },
  phone: {
    type: String,
    minlength: 10,
    maxlength: 10,

    required: true,
  },
  isGold: {
    type: Boolean,
    default: false,
  },
});
const Customer = mongoose.model("Customer", customersSchema);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(10).required(),
    phone: Joi.string().min(10).max(10).required(),
    isGold: Joi.boolean(),
  });
  return schema.validate(customer);
}

module.exports.Customer = Customer;
module.exports.validateCustomer = validateCustomer;
