const Upload = require("../models/upload");
const Course = require("../models/course");
const cloudinary = require("../lib/cloudinary");

exports.uploadVideo = (req, res) => {
  cloudinary.uploader.upload(
    req.file.path,
    {
      resource_type: "video",
      folder: "video",
    },
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      var upload = new Upload({
        name: req.file.originalname,
        url: result.url,
        cloudinary_id: result.public_id,
        desc: req.body.desc,
      });
      upload.save((err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
        return res.status(200).send(result);
      });
    }
  );
};

exports.uploadImage = async (req, res) => {
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
