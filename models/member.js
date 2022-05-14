const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    fName: { type: String },
    lName: { type: String },
    dob: { type: String },
    postal: { type: String },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "User not registered!"],
    },
    mobile: { type: String },
    check1: { type: String },
    check2: { type: String },
    check3: { type: String },
    healthIssue: { type: String },
    health_issue_other: { type: String },
    maritialStatus: { type: String },
    personalIntrest: { type: String },
    personal_intrest_other: { type: String },
    gender: { type: String },
    dod: { type: String },
    stage: { type: String },
    check4: { type: String },
    check5: { type: String },
    check6: { type: String },
    check7: { type: String },
    customRadio1: { type: String },
    customRadio2: { type: String },
    createdAt: { type: Date, default: Date.now },
    Userlikedpost: [String],
  },
  {
    writeConcern: {
      w: "majority",
      j: true,
      wtimeout: 1000,
    },
  }
);

const Member = mongoose.model("Member", memberSchema, "Member");

module.exports = Member;
