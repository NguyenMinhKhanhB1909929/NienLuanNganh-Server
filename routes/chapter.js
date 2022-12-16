const express = require("express");
const router = express.Router();

const {
  createChapter,
  getChapterById,
  deleteChapter,
} = require("../controllers/chapter");

// Get Chapter
router.get("/:id", getChapterById);

// Create Chapter
router.post("/", createChapter);

router.delete("/:id/:courseId", deleteChapter);

module.exports = router;
