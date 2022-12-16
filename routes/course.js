const express = require("express");
const router = express.Router();
const storage = require("../lib/multer");

const verifyToken = require("../middleware/auth");
const Course = require("../models/course");
const Lessons = require("../models/lessons");
const {
  getCourseById,
  deleteCourse,
  createCourse,
  getCourse,
  getMyCourse,
  getCourseSearch,
  getCourseFree,
  getCourseBuy,
} = require("../controllers/course");

// @router GET api/course/free
// @desc get Course
// @access Public

router.get("/free", getCourseFree);

// @router GET api/course/buy
// @desc get Course
// @access Public

router.get("/buy", getCourseBuy);
// @router GET api/course/:id
// @desc get Course by id
// @access Public
router.get("/myCourse", verifyToken, getMyCourse);
router.get("/search", getCourseSearch);
router.get("/:id", getCourseById);

// @router GET api/course/buy
// @desc get Course free
// @access Public
router.get("/", getCourse);

router.post("/", storage.single("file"), createCourse);
// @router POST api/course
// @desc Create Course
// @access Private
//verifyToken

// @router PUT api/course
// @desc Update Course
// @access Private

router.put("/:id", verifyToken, async (req, res) => {
  const { title, img, link, cost, desc } = req.body;

  try {
    const course = await Course.find({ _id: req.params.id });
    let lessons = course[0].lessons;
    console.log(lessons);
    const lesson = await Lessons.find({ _id: "638ebb553e00c377bc15ed9d" });
    lessons.map((a, i) => {});
    // let lessonNew = lessons.filter((lessonX,) => lessonX._id !== lesson[0]._id);
    // let lessonNew = lesson[0];

    // console.log("LessonsNew: ", lessonNew);
    let updateCourse = {
      title,
      img,
      link,
      cost,
      desc,
      lessons: lessonNew,
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

router.delete("/:id", deleteCourse);

module.exports = router;
