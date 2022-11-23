const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const isAuthenticated = require("../middlewares/isAuthenticated");

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
        const userCopy = { ...currentUser._doc };
        delete userCopy.password;
        const authToken = jwt.sign(
          {
            expiresIn: "6h",
            user: userCopy,
          },
          process.env.TOKEN_SECRET,
          {
            algorithm: "HS256",
          }
        );
        res
          .status(200)
          .json({ msg: "Succesfully logged in", token: authToken });
      } else {
        res.status(400).json({ msg: "Incorrect password" });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.json({ errorMessage: error.message });
  }
});

router.get("/verify", isAuthenticated, (req, res) => {
  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and made available on `req.payload`
  console.log(`req.payload`, req.payload);

  // Send back the object with user data
  // previously set as the token payload
  res.status(200).json({ payload: req.payload, message: "Token OK" });
});

module.exports = router;
