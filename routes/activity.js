const express = require("express");
const router = express.Router();
const Member = require("../models/member");

router.get("/", function (req, res) {
  if (req.isAuthenticated()) {
    Member.findOne({ user: req.user._id }, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        res.render("activity", { fname: data.fName });
      }
    });
  } else {
    res.redirect("/");
  }
});

module.exports = router;
