const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User.model");

router.get("/signup", (req, res, next) => {
  res.json("Welcome to signup");
});

router.post("/signup", async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(11);
    const passwordHash = bcrypt.hashSync(req.body.password, salt);

    await User.create({
      username: req.body.username,
      password: passwordHash,
      email: req.body.email,
      membership: req.body.membership,
    });
    res.status(201).json({ msg: "Succesfully created" });
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ errorMessage: error.message });
  }
});

router.get("/login", (req, res, next) => {
  res.json("Login");
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const currentUser = await User.findOne({ username });
    if (!currentUser) {
      res.json({ errorMessage: "No user with this username" });
    } else {
      if (bcrypt.compareSync(password, currentUser.password)) {
        res.status(201).json({ msg: "Succesfully logged in" });
      } else {
        res.status(400).json({ msg: "Incorrect password" });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.json({ errorMessage: error.message });
  }
});

module.exports = router;
