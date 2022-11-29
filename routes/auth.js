const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const isAuthenticated = require("../middlewares/isAuthenticated");
const { token } = require("morgan");
const uploader = require("../middlewares/cloudinary.config.js");
router.post("/signup", uploader.single("imageUrl"), async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(11);
    const passwordHash = bcrypt.hashSync(req.body.password, salt);
    console.log(req.file.path);
    await User.create({
      profile: req.file.path,
      username: req.body.username,
      password: passwordHash,
      email: req.body.email,
      membership: req.body.membership,
    });
    res.status(201).json({ msg: "Succesfully created" });
  } catch (error) {
    console.log("the error", error.message);
    res.status(404).json({ errorMessage: error.message });
  }
});

router.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    const { username, password } = req.body;
    const currentUser = await User.findOne({ username });
    console.log("first currentuser", currentUser);
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
        console.log("the token", authToken);
        res.status(200).json(authToken);
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
  console.log(`req.payload`, req.payload);
  res.status(200).json({ payload: req.payload, message: "Token OK" });
});

module.exports = router;
