const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  fName: { type: String },
  lName: { type: String },
  dob: { type: String },
  postal: { type: String },
  username: { type: String, lowercase: true, unique:true, trim: true },
  mobile: { type: String },
  check1: { type: String },
  check2: { type: String },
  check3: { type: String },
  healthIssue: { type: String },
  maritialStatus: { type: String },
  personalIntrest: { type: String },
  dod: { type: String },
  stage: { type: String },
  check4: { type: String },
  check5: { type: String },
  check6: { type: String },
  time : { type : Date, default: Date.now }
  }, {
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 1000
    }
  });

  const Member = mongoose.model("Member", memberSchema, "Member");
  
  module.exports = Member;