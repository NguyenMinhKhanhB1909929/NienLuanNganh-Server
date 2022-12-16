const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LessonSchema = new Schema({
  title: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
});

module.exports = mongoose.model("lessons", LessonSchema);
