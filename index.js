require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");

const url = process.env.URL;
const app = express();
app.use(flash());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SEC,
    resave: false,
    saveUninitialized: false,
  })
);

//   app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

//Database connection to atlas using mongoose...
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Mongo connected");
  })
  .catch((error) => {
    console.log(error);
  });
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

const User = require("./models/user");

passport.use(User.createStrategy());

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

const member = require("./routes/member");
app.use("/", member);

const chats = require("./routes/chats");
app.use("/chats", chats);

const activity = require("./routes/activity");
app.use("/activity", activity);

const profile = require("./routes/profile");
app.use("/profile", profile);

const login = require("./routes/login");
app.use("/login", login);

const register = require("./routes/register");
app.use("/register", register);

const forgotPass = require("./routes/forgotPass");
app.use("/forgotPass", forgotPass);

//logout request..
app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

app.get("/error", function (req, res) {
  res.render("error");
});

app.get("*", function (req, res) {
  res.render("404error");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("app stared at ", PORT);
});
