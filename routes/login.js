const express = require('express')
const router = express.Router()
const User = require("../models/user");
const passport = require('passport');

function usernameToLowerCase(req, res, next) {
    req.body.username = req.body.username.toLowerCase();
    next();
  }

router.get('/:mode', function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect("/admin");
      }else {
          if(req.params.mode==="admin"){
            res.render("login",{ mode:"admin" });
          }
          if(req.params.mode==="supplier"){
            res.render("login",{ mode:"supplier" });
          }
          if(req.params.mode==="member"){
            res.render("login",{ mode:"member" });
          }
    }
  });

  router.post("/:mode", usernameToLowerCase, passport.authenticate("local", {
    failureRedirect: "/login-fail", failureFlash: true
  }), function (req, res) {
    try {
      let dt= new Date();
            User.findOneAndUpdate({ username : req.body.username.toLowerCase()},{lastLogin: dt},function(err,data){
                if(err){console.log(err);}else{
                    if(data.mode==="admin"){
                        res.redirect("/admin");
                    }
                    if(data.mode==="member"){
                        res.redirect("/dashboard");
                    }
                    if(data.mode==="supplier"){
                        res.redirect("/dashboard");
                    }
                }
            })
    } catch (error) {
      console.log(error);
    }
    
  });

module.exports = router