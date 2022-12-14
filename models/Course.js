const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const courseSchema = new Schema({
  image: {
    type: String
},
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  video: {
    type: String,
  },
  credit:{type: Schema.Types.ObjectId, ref:"User"}
  
});

const Course = model("Course", courseSchema);

module.exports = Course;
