const express = require("express");
const router = express.Router();
const session = require("express-session");
const User = require("../models/user");
const bcrypt = require("bcrypt");

// Create one subscriber
router.post("/register", async (req, res) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password
  });
  try {
    const newUser = await user.save();
    res.redirect("/user_session/profile");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/login", authenticateUser, async (req, res) => {
  // res.render("index");
});

router.get("/login", async (req, res) => {
  res.render("login");
});

router.get("/", async (req, res) => {
  res.render("index");
});

router.get("/register", async (req, res) => {
  res.render("register");
});

router.get("/all", async (req, res) => {
  try {
    // Mongoose method works by returning all associated subscriber objects that meet its criteria.
    const users = await User.find();
    //return the ^
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/logout", async (req, res) => {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if (err) {
        return next(err);
      } else {
        res.render("login");
      }
    });
  }
});

router.get("/profile", requiresLogin, async (req, res) => {
  res.render("dashboard");
});

async function requiresLogin(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    var err = new Error("You must be logged in to view this page.");
    res.render("error", {
      message: "Error : You must be logged in to view this page."
    });
    return next(err);
  }
}

async function authenticateUser(req, res, next) {
  //Mongo reads the JSON stores as object directly
  user = await User.findOne({ email: req.body.email });
  if (req.body.email == null) {
    return res.status(404).json({ message: req.body });
  }
  if (user == null) {
    return res.status(404).json({ message: "Cant find USER" });
  }
  if (req.body.password == null) {
    return res.status(400).json({ messsage: "Password cannot be null" });
  }
  user.comparePassword(req.body.password, (err, isMatch) => {
    if (err) throw err;
    if (!isMatch)
      return res.status(400).json({
        message: "Wrong password"
      });
    req.session.user = user;
    // res.status(200).send("Login successfully");
    res.redirect("/user_session/profile");
  });
  // req.session.user = user;
  //allows the code to move on to the next part of the code
  next();
}

module.exports = router;
