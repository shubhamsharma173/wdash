const express = require('express')
const router = express.Router()
const User = require("../models/user");
const Supplier = require("../models/supplier");
const Member = require("../models/member");
const passport = require('passport');

router.get("/:mode", function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect("/admin");
    } else {
        if(req.params.mode==="admin"){
            res.render("register",{ mode:"admin", message:req.flash('error') });
          }
          if(req.params.mode==="supplier"){
            res.render("register",{ mode:"supplier", message:req.flash('error') });
          }
          if(req.params.mode==="member"){
            res.render("register",{ mode:"member", message:req.flash('error') });
          }
    }
  });

  router.post("/:mode", function (req, res) {
    User.register({ username: req.body.username.toLowerCase() , mode: req.params.mode }, req.body.password, function (err, user) {
      if (err) {
        req.flash('error', err.message);
        res.redirect("/register/"+req.params.mode);
      } else {
        passport.authenticate("local")(req, res, function () {
          User.findOne({ username: req.user.username },  function (err, doc) {
            if (err) {
              console.log(err)
            }
            else {
              if(req.params.mode==="member"){
                let det= new Member({
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
                  dod: req.body.dod,
                  stage: req.body.stage,
                  check4: req.body.check4,
                  check5: req.body.check5,
                  check6: req.body.check6,
                  check7: req.body.check7
                });
                det.save();
              }
              if(req.params.mode==="supplier"){
                let det= new Supplier({
                  bNum: req.body.bNum,
                  bName: req.body.bName,        
                  postal: req.body.postal,       
                  fName: req.body.fName,
                  lName: req.body.lName,
                  user: doc._id,
                  mobile: req.body.mobile,
                  service: req.body.service,
                  qual: req.body.qual,
                  membership: req.body.membership,
                  exp: req.body.exp,
                  skill: req.body.skill,
                  comment: req.body.comment
                });
                det.save();
              }
            }
          });
          req.logout();
          res.render("success");
          //console.log("Original Doc : ",docs);
        });
      }
    });
});

module.exports = router