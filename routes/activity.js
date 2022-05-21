const express = require("express");
const router = express.Router();
const Member = require("../models/member");
const UserPostModal = require("../models/userPost");

router.get("/", function (req, res) {
  if (req.isAuthenticated()) {
    Member.findOne({ user: req.user._id }, function (err, data) {
      if (err) {
        console.log(err);
        res.redirect("/error");
      } else {
        res.render("activity", { fname: data.fName });
      }
    });
  } else {
    res.redirect("/");
  }
});

router.get("/getuserposts/:pg", (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const postPage = req.params["pg"];
      // console.log(postPage)

      UserPostModal.find(
        {},
        null,
        { sort: { time: -1 }, skip: postPage * 5, limit: 5 },
        (err, docs) => {
          err
            ? res.send({ OPstatus: -1, data: err })
            : UserPostModal.find().countDocuments(function (errCount, count) {
                if (errCount) res.send({ OPstatus: -1, data: errCount });
                else {
                  let postLeftCount =
                    parseInt(count) - (5 + parseInt(postPage) * 5);
                  res.send({
                    OPstatus: 1,
                    data: { postLeftCount, docs },
                  });
                }
              });
        }
      );
    } catch (error) {
      res.send({ OPstatus: -1, data: error });
    }
  } else {
    res.redirect("/");
  }
});

router.post("/savepost", (req, res) => {
  if (req.isAuthenticated()) {
    // console.log(req.body);
    const { userId, userName, url, title, description, type } = req.body;
    const logTime = Date.now();

    const newPost = new UserPostModal({
      type: type,
      like: 0,
      title: title,
      description: description,
      url: url,
      time: logTime,
      userId: userId,
      userName: userName,
    });
    // console.log("objj",newPost);
    newPost
      .save()
      .then(() => {
        res.send({ OPstatus: 1, data: "Post saved!" });
      })
      .catch((error) => {
        res.send({ OPstatus: -1, data: error });
      });
  } else {
    res.redirect("/");
  }
});

router.post("/addlike", (req, res) => {
  if (req.isAuthenticated()) {
    const { _id, userId } = req.body;
    UserPostModal.findOne({ _id }, (err, doc) => {
      if (err) res.send({ OPstatus: -1, data: err });
      else {
        if (doc != null) {
          UserPostModal.findOneAndUpdate(
            { _id },
            { like: doc.like + 1 },
            { new: true },
            (error, newdoc) => {
              if (error) res.send({ OPstatus: -1, data: error });
              else {
                Member.findOneAndUpdate(
                  { _id: userId },
                  { $push: { Userlikedpost: "" + _id } },
                  { new: true },
                  (err2, doc2) => {
                    if (err2) res.send({ OPstatus: -1, data: err2 });
                    else res.send({ OPstatus: 1, data: "Post liked." });
                  }
                );
              }
            }
          );
        } else {
          res.send({ OPstatus: -1, data: "Post not found!" });
        }
      }
    });
  } else {
    res.redirect("/");
  }
});

router.post("/dislike", (req, res) => {
  if (req.isAuthenticated()) {
    const { _id, userId } = req.body;
    UserPostModal.findOne({ _id }, (err, doc) => {
      if (err) res.send({ OPstatus: -1, data: err });
      else {
        if (doc != null) {
          UserPostModal.findOneAndUpdate(
            { _id },
            { like: doc.like - 1 },
            { new: true },
            (error, newdoc) => {
              if (error) res.send({ OPstatus: -1, data: error });
              else {
                Member.findOneAndUpdate(
                  { _id: userId },
                  { $pull: { Userlikedpost: "" + _id } },
                  { new: true },
                  (err2, doc2) => {
                    if (err2) res.send({ OPstatus: -1, data: err2 });
                    else res.send({ OPstatus: 1, data: "Removed like from Post." });
                  }
                );
              }
            }
          );
        } else {
          res.send({ OPstatus: -1, data: "Post not found!" });
        }
      }
    });
  } else {
    res.redirect("/");
  }
});

module.exports = router;
