const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

function usernameToLowerCase(req, res, next) {
  req.body.username = req.body.username.toLowerCase();
  next();
}

router.get("/", function (req, res) {
  res.render("login", { message: "" });
});

router.get("/fail", function (req, res) {
  res.render("login", { message: "fail" });
});

router.get("/error", function (req, res) {
  res.render("login", { message: "error" });
});

router.post(
  "/",
  usernameToLowerCase,
  passport.authenticate("local", {
    failureRedirect: "/login/fail",
    failureFlash: true,
  }),
  function (req, res) {
    try {
      let dt = new Date();
      User.findOneAndUpdate(
        { username: req.body.username.toLowerCase() },
        { lastLogin: dt },
        function (err, data) {
          if (err) {
            console.log(err);
          } else {
            res.redirect("/");
          }
        }
      );
    } catch (error) {
      console.log(error);
      res.redirect("/login/error");
    }
  }
);

module.exports = router;
