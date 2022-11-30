const { Schema, model } = require("mongoose");

const ratingSchema = new Schema({
  comment: {
    type: String
},
  rating: {
    type: Number,
},
 
createdBy:{
  type: Schema.Types.ObjectId, ref:"User",
  unique: true,
},

courseID:{type: Schema.Types.ObjectId, ref:"Course"}
  
});

const Rating = model("Rating", ratingSchema);

module.exports = Rating;
