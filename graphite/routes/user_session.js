const express = require("express");
const router = express.Router();
const session = require("express-session");
const User = require("../models/user");
const bcrypt = require("bcrypt");

router.get('/', (req, res) => {
  res.render('index', { title: 'Graphite', home: 'active', user: req.session.user});
});

router.get('/account', requiresLogin, (req, res) => {
res.render('account', { title: 'Graphite', account: 'active', user: req.session.user});
});

router.get('/stories', requiresLogin, (req, res) => {
res.render('stories', { title: 'Graphite', stories: 'active', user: req.session.user});
});

router.get('/new_story', requiresLogin, (req, res) => {
res.render('new_story', { title: 'Graphite', stories: 'active', user: req.session.user});
});

router.post('/new_story', requiresLogin, (req, res) => {
console.log(req.body);
res.render('stories', { title: 'Graphite', stories: 'active', created: "created", user: req.session.user});
});

router.get('/graphs', requiresLogin, (req, res) => {
res.render('graphs', { title: 'Graphite', graphs: 'active', user: req.session.user});
});

// Create one subscriber
router.post("/register", async (req, res) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password
  });
  try {
    const newUser = await user.save();
    res.redirect("/", { title: 'Graphite', home: 'active', user: req.session.user});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/login", authenticateUser, async (req, res) => {
});

router.get("/login", async (req, res) => {
  res.render("login", { title: 'Graphite', login: 'active', user: req.session.user});
});

router.get("/", async (req, res) => {
  res.redirect("/", { title: 'Graphite', home: 'active', user: req.session.user});
});

router.get("/register", async (req, res) => {
  res.render("register", { title: 'Graphite', login: 'active', user: req.session.user});
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
        res.render("login", { title: 'Graphite', login: 'active', user: null});
      }
    });
    console.log(req.session.user);
  }
});

async function requiresLogin(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    var err = new Error("You must be logged in to view this page.");
    res.render("error", {
      title: "Graphite",
      message: "You must be logged in to view this page."
    });
    return next(err);
  }
}

async function authenticateUser(req, res, next) {
  console.log("beginning of function");
  if (!req.body.email) {
    console.log("first one");
    res.render("login", {
      title: "Graphite",
      login: "active",
      message: "Please enter an email."
    });
    return res.status(404).json({ message: "Please enter an email." });
  }
  if (!req.body.password) {
    console.log("first one");
    res.render("login", {
      title: "Graphite",
      login: "active",
      message: "Please enter a password."
    });
    return res.status(404).json({ message: "Please enter a password." });
  }
  //Mongo reads the JSON stores as object directly
  user = await User.findOne({ email: req.body.email });
    if (user == null) {
    console.log("second one");
    res.render("login", {
      title: "Graphite",
      login: "active",
      message: "Unknown user."
    });
    return res.status(404).json({ message: "Unknown user." });
  }
  user.comparePassword(req.body.password, (err, isMatch) => {
    if (err) throw err;
    if (!isMatch) {
      return res.render("login", {
        title: "Graphite",
        login: "active",
        message: "Wrong password."
      });
      // return res.status(400).json({
      //   message: "Wrong password"
      // });
    }
    req.session.user = user;
    // res.status(200).send("Login successfully");
    res.redirect("/");
  });
  // req.session.user = user;
  //allows the code to move on to the next part of the code
  next();
}

module.exports = router;
