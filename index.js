require('dotenv').config()
const express = require('express');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
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

  
const User = require("./models/user")

passport.use(User.createStrategy());

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

const home = require('./routes/home')
app.use('/', home);

const chats = require('./routes/chats')
app.use('/chats', chats);

const admin = require('./routes/admin')
app.use('/admin', admin);

const doctor = require('./routes/doctor')
app.use('/doctor', doctor);

const patient = require('./routes/patient')
app.use('/patient', patient);

const dashboard = require('./routes/dashboard')
app.use('/dashboard', dashboard);
  

//login page get request..
app.get('/login/:mode', function (req, res) {
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
  
  
  //register page get request..
  app.get("/register/:mode", function (req, res) {
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
  
  //register page post request..
  app.post("/register/:mode", function (req, res) {
    User.register({ username: req.body.username.toLowerCase() }, req.body.password, function (err, user) {
      if (err) {
        req.flash('error', err.message);
        res.redirect("/register/"+req.params.mode);
      } else {
        passport.authenticate("local")(req, res, function () {
          User.findOneAndUpdate({ username: req.user.username }, {
            fullName: req.body.name,
            mode: req.params.mode
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

  app.post("/login/:mode", usernameToLowerCase, passport.authenticate("local", {
    failureRedirect: "/login-fail", failureFlash: true
  }), function (req, res) {
    try {
            User.findOne({ username : req.body.username.toLowerCase()},function(err,data){
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
  
  app.get("/login-fail", function (req, res) {
    req.flash('info', 'Invalid username or password, Please try again!');
    res.redirect('/')
  })

  //logout request..
  app.get("/logout", function (req, res) {
        req.logout();
        res.redirect("/");
  });

  const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('app stared at ', PORT)
});