const router = require("express").Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const User = require("../models/User.model");
const Course = require("../models/Course");

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.get("/courses", async (req, res, next) => {
  const courses = await Course.find();

  res.json(courses);
});

router.post("/create", async (req, res, next) => {
  try {
    const createCourse = await Course.create(req.body);

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

router.delete("/course/:id", async (req, res, next) => {
  const { id } = req.params;
  const course = await Course.findByIdAndDelete(id);

  res.json({ msg: "Succesfully Deleted", course });
});

module.exports = router;
