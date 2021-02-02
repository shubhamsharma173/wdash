const { Router } = require("express");

const express = require('express')
const router = express.Router()

router.get("/", function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect("admin");
      }else {
        res.render("home",{message: req.flash('info')});
    }
});

module.exports = router