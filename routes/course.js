const express = require("express");
const router = express.Router();
const storage = require("../lib/multer");
const uploadController = require("../controllers/upload");

const verifyToken = require("../middleware/auth");
const Course = require("../models/course");

// @router GET api/course/free
// @desc get Course
// @access Public

router.get("/free", async (req, res) => {
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
});

// @router GET api/course/buy
// @desc get Course
// @access Public

router.get("/buy", async (req, res) => {
  try {
    const courses = await Course.find({ cost: { $ne: 0 } });
    res.json({
      success: true,
      message: "Get free course successfully",
      course: courses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
// @router GET api/course/:id
// @desc get Course by id
// @access Public
router.get("/:id", async (req, res) => {
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
});

// @router GET api/course/buy
// @desc get Course free
// @access Public
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json({
      success: true,
      message: "Get all course successfully",
      course: courses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @router GET api/course/
// @desc get Course free
// @access Public
router.get("/buy", async (req, res) => {
  try {
    const courses = await Course.find();
    console.log(courses);
    res.json({
      success: true,
      message: "Get all course successfully",
      course: courses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post(
  "/uploadsImg",
  storage.single("file"),
  uploadController.uploadImage
);
// @router POST api/course
// @desc Create Course
// @access Private
//verifyToken
router.post("/", async (req, res) => {
  const { title, cost, desc } = req.body;

  // Simple validation
  if (!title || !cost || !desc)
    return res.status(400).json({ success: false, message: "Missing" });

  try {
    const newCourse = new Course({
      title,
      cost,
      desc,
      member: 0,
      rate: 0,
    });
    await newCourse.save();
    return res.json({
      success: true,
      message: "Create Course successfully",
      course: newCourse,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Server is not connect" });
  }
});

// @router PUT api/course
// @desc Update Course
// @access Private

router.put("/:id", verifyToken, async (req, res) => {
  const { title, img, link, cost, desc } = req.body;

  try {
    let updateCourse = {
      title,
      img,
      link,
      cost,
      desc,
    };

    const courseUpdateCondition = { _id: req.params.id };
    updateCourse = await Course.findByIdAndUpdate(
      courseUpdateCondition,
      updateCourse,
      {
        new: true,
      }
    );

    if (!updateCourse)
      return res
        .status(401)
        .json({ success: false, message: "Course not found" });
    res.json({ success: true, message: "Update course successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Server is not connect" });
  }
});

// @router DELETE api/course
// @desc Delete Course
// @access Private

router.delete("/:id", async (req, res) => {
  const { title, img, link } = req.body;

  try {
    const courseDeleteCondition = { _id: req.params.id };
    const deleteCourse = await Course.findOneAndDelete(courseDeleteCondition);

    if (!deleteCourse)
      return res
        .status(401)
        .json({ success: false, message: "Course deleted not found" });

    res.json({
      success: true,
      message: "Delete course successfully",
      course: deleteCourse,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Server is not connect" });
  }
});

module.exports = router;
