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

router.get("/auth/profile/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    res.json({ ...user._doc });
  } catch (error) {
    res.status(404).json({ message: "No User with this id" });
  }
});

//////// update user

router.put(
  "/profile/:id",
  uploader.single("imageUrl"),
  async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    try {
      const salt = bcrypt.genSaltSync(11);
      const passwordHash = bcrypt.hashSync(req.body.password, salt);
      const data = {
        username: req.body.username,
        email: req.body.email,
        password: passwordHash,
        membership: req.body.membership,
        profile: req.file.path,
      };
      console.log(data);
      const edit = await User.findByIdAndUpdate(id, data, {
        new: true,
      });
      res.json({ msg: "Succesfully Updated", edit });
    } catch (error) {
      console.log("the error", error.message);
      res.status(404).json({ errorMessage: error.message });
    }
  }
);

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

router.get("/verify", isAuthenticated, async (req, res) => {
  const findUser = await User.findById(req.payload.user._id);
  console.log(`req.payload`, req.payload);
  res
    .status(200)
    .json({ payload: req.payload, message: "Token OK", findUser: findUser });
});

module.exports = router;
