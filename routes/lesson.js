const express = require("express");
const router = express.Router();

const storage = require("../lib/multer");

const {
  getLesson,
  createLesson,
  getLessonById,
  deleteLesson,
} = require("../controllers/lesson");

router.get("/:chapterId", getLesson);
router.get("/lessonId/:id", getLessonById);

router.delete("/:id/:chapterId", deleteLesson);

router.post("/", storage.single("file"), createLesson);

module.exports = router;
