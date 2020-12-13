require('dotenv').config()
const express = require('express');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passportLocalMongoose = require("passport-local-mongoose");
const passport = require('passport');
const flash = require("connect-flash");

const url = process.env.URL;
const app = express();
app.use(flash());
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
  }));
  
//   app.use(cors());
  app.use(passport.initialize());
  app.use(passport.session());
  
  //Database connection to atlas using mongoose...
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=>{console.log("Mongo connected");})
  .catch((error)=>{console.log(error)})
  mongoose.set("useCreateIndex", true);
  mongoose.set('useFindAndModify', false);

  const userSchema = new mongoose.Schema({
    fullName: String,
    username: String,
    salt: String,
    hash: String
  }, { collection: "users" });
  userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema, "users");

passport.use(User.createStrategy());

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.get("/", function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect("admin");
      }else {
        res.render("home");
    }
  });

  app.get("/admin",function(req,res){
    if (req.isAuthenticated()) {
        res.render("admin");
      }else {
        res.redirect("/login-simple");
    }
  })
  app.get("/doctor",function(req,res){
    if (req.isAuthenticated()) {
        res.render("doctorList");
      }else {
        res.redirect("/login-simple");
    }
  })
  app.get("/patient",function(req,res){
    if (req.isAuthenticated()) {
        res.render("patientList");
      }else {
        res.redirect("/login-simple");
    }
  })
  app.get("/chats",function(req,res){
    if (req.isAuthenticated()) {
        res.render("chats");
      }else {
        res.redirect("/login-simple");
    }
  })

  let flag=0;
  //login page get request..
app.get('/login-simple', function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect("/admin");
      }else {
        res.render("login-simple");
    }
  });
  
  
  //register page get request..
  app.get("/register", function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect("/admin");
    } else {
        res.render("register");
    }
  });
  
  //register page post request..
  app.post("/register", function (req, res) {
    User.register({ username: req.body.username.toLowerCase() }, req.body.password, function (err, user) {
      if (err) {
        console.log(err.message);
        flag = 3;
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function () {
          User.findOneAndUpdate({ username: req.user.username }, {
            fullName: req.body.name
          }, null, function (err, docs) {
            if (err) {
              console.log(err)
            }
            else {
              req.logout();
              res.render("success");
              //console.log("Original Doc : ",docs);
            }
          });
        });
      }
    });
  });
  
  //login page post request..
  function usernameToLowerCase(req, res, next) {
    req.body.username = req.body.username.toLowerCase();
    next();
  }
  
//   app.post("/login-simple", function (req, res) {
//     try {
//         console.log(req.body);
//         var authenticate = User.authenticate();
//         authenticate(req.body.username, req.body.password, function(err, result) {
//             if (err) { console.log(err); }else{
//                 console.log(result);
//                 res.redirect("/admin");
//             }
//         });
//     } catch (error) {
//       console.log(error);
//     }
    
//   });

  app.post("/login-simple", usernameToLowerCase, passport.authenticate("local", {
    failureRedirect: "/login-fail", failureFlash: true
  }), function (req, res) {
    try {
        res.redirect("/admin");
    } catch (error) {
      console.log(error);
    }
    
  });
  
  app.get("/login-fail", function (req, res) {
    flag = 0;
    req.flash('info', 'Invalid username or password');
    res.redirect('/login-simple')
  })

  //logout request..
  app.get("/logout", function (req, res) {
        req.logout();
        res.redirect("/login-simple");
  });

  const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log('app stared at ', PORT)
});