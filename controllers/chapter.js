const Chapter = require("../models/chapter");
const Course = require("../models/course");
const Lesson = require("../models/lessons");

exports.createChapter = async (req, res) => {
  const { title, chapterId } = req.body;
  const id = chapterId;
  try {
    const newChapter = new Chapter({
      title,
    });
    await newChapter.save();
    const course = await Course.find({ _id: id });
    let lessons = course[0].lessons;
    let lessonNew = [...lessons, newChapter._id];
    let updateCourse = {
      lessons: lessonNew,
    };
    const courseUpdateCondition = { _id: id };
    updateCourse = await Course.findByIdAndUpdate(
      courseUpdateCondition,
      updateCourse,
      {
        new: true,
      }
    );

    return res.json({
      success: true,
      message: "Create Chapter successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getChapterById = async (req, res) => {
  try {
    let chapters = [];
    const course = await Course.find({ _id: req.params.id });
    const lessons = course[0].lessons;

    await lessons.map(async (lesson, index) => {
      const chapter = await Chapter.find({ _id: lesson });
      chapters = [...chapters, chapter[0]];
      if (index == lessons.length - 1) {
        res.json({ success: true, chapters });
      }
    });
  } catch (error) {}
};

exports.deleteChapter = async (req, res) => {
  try {
    console.log(req.params.id);
    console.log(req.params.courseId);
    const chapterDeleteCondition = { _id: req.params.id };
    const course = await Course.find({ _id: req.params.courseId });
    const lessons = await Chapter.find({ _id: req.params.id });
    let videos = lessons[0].videos;
    videos.map(async (video) => {
      const lessonDeleteCondition = { _id: video._id };
      const deleteLesson = await Lesson.findOneAndDelete(lessonDeleteCondition);
    });
    let chapters = course[0].lessons;
    const newChapters = chapters.filter((chapter) => chapter != req.params.id);
    let updateCourse = {
      lessons: newChapters,
    };
    const courseUpdateCondition = { _id: req.params.courseId };
    updateCourse = await Course.findByIdAndUpdate(
      courseUpdateCondition,
      updateCourse,
      {
        new: true,
      }
    );
    const deleteChapter = await Chapter.findOneAndDelete(
      chapterDeleteCondition
    );
    if (!deleteChapter)
      return res
        .status(401)
        .json({ success: false, message: "Chapter deleted not found" });
    res.json({
      success: true,
      message: "Delete Chapter successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};
