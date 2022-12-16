const Lesson = require("../models/lessons");
const Chapter = require("../models/chapter");
const cloudinary = require("../lib/cloudinary");

exports.getLesson = async (req, res) => {
  try {
    let lessons = [];
    const chapter = await Chapter.find({ _id: req.params.chapterId });
    const videos = chapter[0].videos;
    await videos.map(async (video, index) => {
      const lesson = await Lesson.find({ _id: video });
      lessons = [...lessons, lesson[0]];
      if (index == videos.length - 1) {
        res.json({ success: true, lessons });
      }
    });
  } catch (error) {}
};

exports.getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.find({ _id: req.params.id });
    res.json({
      success: true,
      message: "Get lesson by id successfully",
      lesson: lesson,
    });
  } catch (error) {}
};

exports.createLesson = async (req, res) => {
  const { title, chapterId } = req.body;
  let id = chapterId;
  if (!title)
    return res.status(400).json({ success: false, message: "Missing" });

  try {
    await cloudinary.uploader.upload(
      req.file.path,
      {
        resource_type: "video",
        folder: "video",
      },
      async (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }

        const newLesson = new Lesson({
          title,
          videoUrl: result.url,
        });
        newLesson.save();
        const chapter = await Chapter.find({ _id: id });
        let videos = chapter[0].videos;
        let newVideos = [...videos, newLesson];
        let updateChapter = {
          videos: newVideos,
        };
        const chapterUpdateCondition = { _id: id };
        updateChapter = await Chapter.findByIdAndUpdate(
          chapterUpdateCondition,
          updateChapter,
          {
            new: true,
          }
        );
        return res.json({
          success: true,
          message: "Create Course successfully",
          lesson: newLesson,
        });
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, message: "Server is not connect" });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const lessonDeleteCondition = { _id: req.params.id };
    const chapter = await Chapter.find({ _id: req.params.chapterId });
    let videos = chapter[0].videos;
    const newVideos = videos.filter((video) => video._id != req.params.id);
    let updateChapter = {
      videos: newVideos,
    };
    const chapterUpdateCondition = { _id: req.params.chapterId };
    updateChapter = await Chapter.findByIdAndUpdate(
      chapterUpdateCondition,
      updateChapter,
      {
        new: true,
      }
    );
    const deleteLesson = await Lesson.findOneAndDelete(lessonDeleteCondition);
    if (!deleteLesson)
      return res
        .status(401)
        .json({ success: false, message: "Lesson deleted not found" });
    res.json({
      success: true,
      message: "Delete Lesson successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};
