const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChapterSchema = new Schema({
  title: {
    type: String,
  },
  videos: {
    type: Array,
  },
});

module.exports = mongoose.model("chapters", ChapterSchema);
