const express = require('express')
const router = express.Router()

router.get("/", function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect("admin");
      }else {
        res.redirect("/login/member");
    }
});

module.exports = router