const User = require("../models/User");
const Course = require("../models/course");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

exports.addCourseToUser = async (req, res) => {
  try {
    const course = await Course.find({ _id: req.params.id });
    const user = await User.find({ _id: req.userId });
    let myCourses = user[0].myCourses;
    myCourses = [...myCourses, course[0]._id];
    let updateUser = {
      myCourses,
    };
    const userUpdateCondition = { _id: req.userId };
    updateUser = await User.findByIdAndUpdate(userUpdateCondition, updateUser, {
      new: true,
    });
    return res.json({
      success: true,
      message: "Add course to user successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword, reNewPassword } = req.body;
  if (!oldPassword || !newPassword || !reNewPassword) {
    return res.status(400).json({ success: false, message: "Empty" });
  }
  if (newPassword !== reNewPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Retype password not found" });
  }
  try {
    const user = await User.findOne({ _id: req.userId });
    const passwordValid = await argon2.verify(user.password, oldPassword);
    console.log(passwordValid);
    if (!passwordValid)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });
    const hashedPassword = await argon2.hash(newPassword);
    let updatePassword = {
      password: hashedPassword,
    };
    const passwordUpdateCondition = { _id: req.userId };
    updatePassword = await User.findByIdAndUpdate(
      passwordUpdateCondition,
      updatePassword,
      {
        new: true,
      }
    );
    res.json({ success: true, message: "Update password successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Update password fail!" });
  }
};

exports.registerUser = async (req, res) => {
  const { username, password, fullname, rePassword } = req.body;

  // Simple validation
  if (!username || !password || !fullname || !rePassword)
    return res
      .status(400)
      .json({ success: false, message: "Missing username and/or password" });
  if (password !== rePassword) {
    return res
      .status(400)
      .json({ success: false, message: "retype password not found" });
  }
  try {
    const user = await User.findOne({ username });

    if (user)
      return res
        .status(400)
        .json({ success: false, message: "Username already" });

    const hashedPassword = await argon2.hash(password);
    const rule = "user";
    const newUser = new User({
      fullname,
      username,
      password: hashedPassword,
      rule,
    });
    await newUser.save();

    // Return token
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({
      success: true,
      message: "User created successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.changeInfo = async (req, res) => {
  const { email, fullname, phone } = req.body;
  if (!fullname) {
    return res.status(400).json({ success: false, message: "Empty" });
  }
  try {
    const user = await User.findOne({ _id: req.userId });
    let updateUserInfo = {
      email,
      fullname,
      phone,
    };
    const userInfoUpdateCondition = { _id: req.userId };
    updateUserInfo = await User.findByIdAndUpdate(
      userInfoUpdateCondition,
      updateUserInfo,
      {
        new: true,
      }
    );
    res.json({ success: true, message: "Update info successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Update info fail!" });
  }
};

exports.getAllUser = async (req, res) => {
  const { page = 1, pageSize = 5 } = req.query;
  let numberSkip = (page - 1) * pageSize;
  try {
    const user = await User.find()
      .select("-password")
      .skip(numberSkip)
      .limit(pageSize);
    const allUser = await User.find({});
    res.json({
      success: true,
      message: "Get all user successfully",
      user: user,
      userLength: allUser.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
