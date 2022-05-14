const mongoose = require("mongoose");
let ObjectId = mongoose.Schema.ObjectId;
const UserPosts = new mongoose.Schema({
  type: String,
  like: Number,
  url: String,
  title: String,
  description: String,
  time: {
    type: Date,
    default: Date.now(),
  },
  userId: { type: ObjectId, ref: "Member" },
  userName: String,
});
const userPost = new mongoose.model("userPost", UserPosts);
module.exports = userPost;
