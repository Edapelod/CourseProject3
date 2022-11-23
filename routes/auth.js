const router = require("express").Router();
const bcrypt = require('bcrypt')

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
      email:req.body.email,
      membership:req.body.membership
    });
    res.status(201).json({msg:"Succesfully created"});
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ errorMessage: error.message });
  }
});


router.get("/login", (req, res, next) => {
  res.json("Login");
});

module.exports = router;
