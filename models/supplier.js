const mongoose = require("mongoose");

const suppSchema = new mongoose.Schema({
    bNum: { type: String },
    bName: { type: String },
    postal: { type: String },
    fName: { type: String },
    lName: { type: String },
    username: { type: String, lowercase: true, unique:true, trim: true },
    mobile: { type: String },
    service: { type: String },
    qual: { type: String },
    membership: { type: String },
    exp: { type: String },
    skill: { type: String },
    comment: { type: String },
    time : { type : Date, default: Date.now }
  }, {
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 1000
    }
  });

  const Supplier = mongoose.model("Supplier", suppSchema, "Supplier");
  
  module.exports = Supplier;