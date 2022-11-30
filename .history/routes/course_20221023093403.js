const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth");
const Course = require("../models/course");

// @router GET api/course
// @desc get Course
// @access Public

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json({
      success: true,
      message: "Get all course successfully",
      course: { courses },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @router POST api/course
// @desc Create Course
// @access Private
router.post("/", verifyToken, async (req, res) => {
  const { title, img, link } = req.body;

  // Simple validation
  if (!title || !img || !link)
    return res.status(400).json({ success: false, message: "Missing" });

  try {
    const newCourse = new Course({ title, img, link });
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

router.post("/:id", verifyToken, async (req, res) => {
  const { title, img, link } = req.body;

  if (!title || !img || !link)
    return res.status(400).json({ success: false, message: "Missing" });

  try {
    let updateCourse = {
      title,
      img,
      link,
    };

    const courseUpdateCondition = (updateCourse =
      await Course.findByIdAndUpdate(courseUpdateCondition, updateCourse, {
        new: true,
      }));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Server is not connect" });
  }
});

module.exports = router;
