const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    fullName: String,
    username: String,
    mode: String,
    salt: String,
    hash: String,
    time : { type : Date, default: Date.now }
  }, {
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 1000
    }
  });
  userSchema.plugin(passportLocalMongoose);
  const User = new mongoose.model("User", userSchema, "users");
  
  module.exports = User;