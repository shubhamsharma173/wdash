const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Member = require("../models/member");
const passport = require("passport");

router.get("/", function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    res.render("register");
  }
});

router.post("/:mode", function (req, res) {
  try {
    // console.log(req.body);
    User.register(
      { username: req.body.username.toLowerCase(), mode: req.params.mode },
      req.body.password,
      function (err, user) {
        if (err) {
          res.send(err.message);
        } else {
          passport.authenticate("local")(req, res, function () {
            User.findOne(
              { username: req.user.username.toLowerCase() },
              function (err1, doc) {
                if (err1) {
                  res.send(err1);
                } else {
                  let det = new Member({
                    fName: req.body.fName,
                    lName: req.body.lName,
                    dob: req.body.dob,
                    postal: req.body.postal,
                    user: doc._id,
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
                    check4: req.body.check4,
                    check5: req.body.check5,
                    check6: req.body.check6,
                    check7: req.body.check7,
                    customRadio1: req.body.customRadio1,
                    customRadio2: req.body.customRadio2,
                  });
                  det
                    .save()
                    .then(() => {
                      req.logout();
                      res.send("success");
                    })
                    .catch((error) => {
                      res.send(error);
                    });
                }
              }
            );
          });
        }
      }
    );
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
