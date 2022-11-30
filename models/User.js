const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  rule: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  fullname: {
    type: String,
  },
});

module.exports = mongoose.model("users", UserSchema);
