const Course = require("../models/course");
const Chapter = require("../models/chapter");
const Lesson = require("../models/lessons");
const User = require("../models/User");
const cloudinary = require("../lib/cloudinary");

exports.getCourse = async (req, res) => {
  const { page = 1, pageSize = 5 } = req.query;
  let numberSkip = (page - 1) * pageSize;
  try {
    const courses = await Course.find().skip(numberSkip).limit(pageSize);
    const allCourses = await Course.find();
    res.json({
      success: true,
      message: "Get all course successfully",
      course: courses,
      courseLength: allCourses.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const courses = await Course.find({ _id: req.params.id });
    res.json({
      success: true,
      message: "Get ID course successfully",
      course: courses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getMyCourse = async (req, res) => {
  let myCourses = [];
  try {
    const user = await User.findOne({ _id: req.userId });
    const myCoursesId = user.myCourses;
    myCoursesId.map(async (courseId, index) => {
      const course = await Course.findOne({ _id: courseId });
      myCourses = [...myCourses, course];
      if (myCoursesId.length - 1 == index) {
        return res.json({
          success: true,
          message: "get my course successfully",
          myCourses,
        });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "No connect to server" });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const courseDeleteCondition = { _id: req.params.id };
    const course = await Course.find({ _id: req.params.id });
    let chapters = course[0].lessons;
    chapters.map(async (chapter) => {
      const chapterDeleteCondition = { _id: chapter };
      const lessons = await Chapter.find({ _id: chapter });
      let videos = lessons[0].videos;
      videos.map(async (video) => {
        const lessonDeleteCondition = { _id: video._id };
        const deleteLesson = await Lesson.findOneAndDelete(
          lessonDeleteCondition
        );
      });
      const deleteChapter = await Chapter.findOneAndDelete(
        chapterDeleteCondition
      );
    });
    const deleteCourse = await Course.findOneAndDelete(courseDeleteCondition);

    if (!deleteCourse)
      return res
        .status(401)
        .json({ success: false, message: "Course deleted not found" });

    res.json({
      success: true,
      message: "Delete course successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Server is not connect" });
  }
};

exports.createCourse = async (req, res) => {
  const { title, cost, desc, member, rate } = req.body;
  if (!title || !cost || !desc)
    return res.status(400).json({ success: false, message: "Missing" });

  try {
    await cloudinary.uploader.upload(
      req.file.path,
      {
        resource_type: "image",
        folder: "image",
      },
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
        const newCourse = new Course({
          title: title,
          cost: cost,
          desc: desc,
          imgUrl: result.url,
          member: 0,
          rate: 0,
        });
        newCourse.save();
        return res.json({
          success: true,
          message: "Create Course successfully",
          course: newCourse,
        });
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, message: "Server is not connect" });
  }
};

exports.getCourseSearch = async (req, res) => {
  let { title } = req.query;
  try {
    const courses = await Course.find({ title: { $regex: title } });
    res.json({ success: true, courseFind: courses, keyWord: title });
  } catch (error) {
    res.status({ success: false, message: "NOT CONNECT TO SERVER" });
  }
};

exports.getCourseFree = async (req, res) => {
  try {
    const courses = await Course.find({ cost: 0 });
    res.json({
      success: true,
      message: "Get free course successfully",
      course: courses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getCourseBuy = async (req, res) => {
  let pageSize = req.query.isAll == 1 ? 8 : 4;
  try {
    const courses = await Course.find({ cost: { $ne: 0 } }).limit(pageSize);
    res.json({
      success: true,
      message: "Get free course successfully",
      course: courses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
