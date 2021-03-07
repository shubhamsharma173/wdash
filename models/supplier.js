const mongoose = require("mongoose");

const suppSchema = new mongoose.Schema({
    bNum: { type: String },
    bName: { type: String },
    postal: { type: String },
    fName: { type: String },
    lName: { type: String },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'User not registered!']
    },
    mobile: { type: String },
    service: { type: String },
    qual: { type: String },
    membership: { type: String },
    exp: { type: String },
    skill: { type: String },
    comment: { type: String },
    createdAt : { type : Date, default: Date.now }
  }, {
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 1000
    }
  });

  const Supplier = mongoose.model("Supplier", suppSchema, "Supplier");
  
  module.exports = Supplier;