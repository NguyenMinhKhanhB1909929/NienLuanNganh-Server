const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  cost: {
    type: Number,
  },
  desc: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
  },
  member: {
    type: Number,
  },
  imgUrl: {
    type: String,
  },
  lessons: {
    type: Array,
  },
});

module.exports = mongoose.model("courses", CourseSchema);
