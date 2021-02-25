const express = require('express')
const router = express.Router()

router.get("/",function(req,res){
    if (req.isAuthenticated()) {
        res.render("chats");
      }else {
        res.redirect("/");
    }
})

module.exports = router