const router = require("express").Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const User = require("../models/User.model");

const Course = require("../models/Course");
const uploader = require("../middlewares/cloudinary.config.js");
const { json } = require("express");

router.get("/courses", async (req, res, next) => {
  const courses = await Course.find();

  res.json(courses);
});

router.post("/create", uploader.single("imageUrl"), async (req, res, next) => {
  console.log(req.body, req.file);
  const data = {
    title: req.body.title,
    price: req.body.price,
    video: req.body.video,
    description: req.body.description,
    image: req.file.path,
  };
  try {
    console.log(data);
    const createCourse = await Course.create(data);

    res.status(201).json({ msg: "Succesfully Created", createCourse });
  } catch (err) {
    console.log(err);
  }
});

router.get("/course/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    res.json({ ...course._doc });
  } catch (error) {
    res.status(404).json({ message: "No Course with this id" });
  }
});

router.put("/course/:id", async (req, res, next) => {
  const { id } = req.params;
  const body = req.body;
  const course = await Course.findByIdAndUpdate(id, body, {
    new: true,
  });
  res.json({ msg: "Succesfully Updated", course });
});

router.post("/credit", isAuthenticated, async (req, res, next) => {
  const userConnected = req.payload.user._id;
  console.log("user console", userConnected);
  const body = req.body.credit;
  const theUser = await User.findById(userConnected);
  const userFound = await User.findByIdAndUpdate(
    userConnected,
    { credit: theUser.credit + body },
    {
      new: true,
    }
  );
  res.json({ msg: "Credit updated", userFound });
});

router.delete("/course/:id", async (req, res, next) => {
  const { id } = req.params;
  const course = await Course.findByIdAndDelete(id);

  res.json({ msg: "Succesfully Deleted", course });
});

module.exports = router;
