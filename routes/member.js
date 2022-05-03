const express = require("express");
const router = express.Router();
const Member = require("../models/member");

router.get("/", function (req, res) {
  if (req.isAuthenticated()) {
    Member.findOne({ user: req.user._id }, function (err, data) {
      if (err) {
        console.log(err);
        res.redirect('/error');
      } else {
        res.render("dashboard", { fname: data.fName });
      }
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/getUserInfo", function (req, res) {
  if (req.isAuthenticated()) {
    Member.findOne({ user: req.user._id }, function (err, data) {
      if (err) {
        res.send({ OPstatus: -1, data: err });
      } else {
        res.send({ OPstatus: 1, data });
      }
    });
  } else {
    res.redirect("/login");
  }
});

router.post("/updateUserInfo", function (req, res) {
  if (req.isAuthenticated()) {
    Member.findOneAndUpdate(
      { _id: req.body._id },
      {
        fName: req.body.fName,
        lName: req.body.lName,
        dob: req.body.dob,
        postal: req.body.postal,
        mobile: req.body.mobile,
        check1: req.body.check1,
        check2: req.body.check2,
        check3: req.body.check3,
        healthIssue: req.body.healthIssue,
        maritialStatus: req.body.maritialStatus,
        personalIntrest: req.body.personalIntrest,
        health_issue_other: req.body.health_issue_other,
        gender: req.body.gender,
        personal_intrest_other: req.body.personal_intrest_other,
        dod: req.body.dod,
        stage: req.body.stage,
        check1: req.body.check1,
        check2: req.body.check2,
        check3: req.body.check3,
      },
      { new: true },
      function (err, data) {
        if (err) {
          res.send({ OPstatus: -1, data: err });
        } else {
          res.send({ OPstatus: 1, data });
        }
      }
    );
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
