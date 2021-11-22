const express = require("express");
const router = express.Router();

router.get("/home", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("dashboard");
  } else {
    res.redirect("/");
  }
});

router.get("/list", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("supplier", { user: "user" });
  } else {
    res.redirect("/");
  }
});

module.exports = router;
