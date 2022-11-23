const router = require("express").Router();
const { genSaltSync, hashSync, compareSync } = require("bcryptjs");
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
    });
    res.json("Succesfully created");
  } catch (error) {
    console.log(error.message);
    res.json("auth/signup", { errorMessage: error.message });
  }
});

router.get("/login", (req, res, next) => {
  res.json("Login");
});

module.exports = router;
