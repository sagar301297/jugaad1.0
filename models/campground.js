var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
  adTitle      : String,
  category     : String,
  contactNumber: Number,
  college      : String,
  name         : String,
  price        : String,
  image        : String,
  description  : String,
  author : {
    id:{
      type : mongoose.Schema.Types.ObjectId,
      ref : "user"
    },
    username : String
  }
  // comments : [
  //   {
  //     type : mongoose.Schema.Types.ObjectId,
  //     ref : "comments"
  //   }
  // ]
});

module.exports = mongoose.model("campground",campgroundSchema);
