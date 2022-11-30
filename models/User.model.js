const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: [true, "Username is required."],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required."],
  },
  membership: {
    type: String,
    required: [true, "Please select one option"],
    enum: ["teacher", "student"],
  },
  credit: {
    type: Number,
    default: 0,
  },
  profile:{
    type:String,
  },
  role:{
    type:String,
    enum: ["admin", "user"],
    default: "user",
  }
});


const User = model("User", userSchema);

module.exports = User;
