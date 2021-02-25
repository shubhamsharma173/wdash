const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    fullName: { type: String, lowercase: true, trim: true },
    username: { type: String, lowercase: true, unique:true, trim: true },
    mode: { type: String},
    salt: { type: String},
    hash: { type: String},
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