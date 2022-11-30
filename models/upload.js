const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const uploadSchema = new Schema({
  name: String,
  url: String,
  cloudinary_id: String,
  desc: String,
});

module.exports = mongoose.model("upload", uploadSchema);
