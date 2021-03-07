const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    fullName: { 
      type: String, 
      lowercase: true, 
      trim: true 
    },
    username: { 
      type: String, 
      lowercase: true, 
      unique:true,
      trim: true,
      required: [true, 'User must have a username!']
    },
    mode: { 
      type: String,
      required: [true, 'User must have a mode!']
    },
    salt: { type: String},
    hash: { type: String},
    createdAt : { type : Date, default: Date.now }
  }, {
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 1000
    }
  });
  userSchema.plugin(passportLocalMongoose);
  const User =  mongoose.model("User", userSchema, "users");
  
  module.exports = User;