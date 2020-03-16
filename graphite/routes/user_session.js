const express = require("express");
const router = express.Router();
const session = require("express-session");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

router.get("/", (req, res) => {
  res.render("index", {
    title: "Graphite",
    home: "active",
    user: req.session.user
  });
});

router.get("/account", requiresLogin, (req, res) => {
  res.render("account", {
    title: "Graphite",
    account: "active",
    user: req.session.user
  });
});

router.get("/stories", requiresLogin, (req, res) => {
  res.render("stories", {
    title: "Graphite",
    stories: "active",
    user: req.session.user
  });
});

router.get("/new_story", requiresLogin, (req, res) => {
  res.render("new_story", {
    title: "Graphite",
    stories: "active",
    user: req.session.user
  });
});

router.post("/new_story", requiresLogin, (req, res) => {
  console.log(req.body);
  res.render("stories", {
    title: "Graphite",
    stories: "active",
    created: "created",
    user: req.session.user
  });
});

router.get("/graphs", requiresLogin, (req, res) => {
  res.render("graphs", {
    title: "Graphite",
    graphs: "active",
    user: req.session.user
  });
});

router.get("/force_directed", (req, res) => {
  res.render("force_directed");
});

router.get("/tidy_tree", (req, res) => {
  res.render("tidy_tree");
});

router.get("/collapse_tree", (req, res) => {
  res.render("collapse_tree");
});

router.get("/bar_chart", (req, res) => {
  res.render("bar_chart");
});

// Create one subscriber
router.post("/register", async (req, res) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password
  });
  try {
    const newUser = await user.save();
    res.redirect(
      {
        title: "Graphite",
        home: "active",
        user: req.session.user
      },
      "/"
    );
  } catch (err) {
    res.render("register", {
      title: "Graphite",
      login: "active",
      message: err.message
    });
    res.status(400).json({ message: err.message });
  }
});

router.post("/login", authenticateUser, async (req, res) => {});

router.get("/login", async (req, res) => {
  res.render("login", {
    title: "Graphite",
    login: "active",
    user: req.session.user
  });
});

router.get("/forget_password", async (req, res) => {
  res.render("forget_password", {
    title: "Graphite",
    login: "active",
    user: req.session.user
  });
});

router.post("/forget_password", async (req, res) => {
  user = await User.findOne({ email: req.body.email });
  res.user = user;
  console.log(res.user);
  if (user == null) {
    return res
      .status(404)
      .json({ message: "User not found! please enter a valid email" });
  } else {
    //create random string
    var randomstring = Math.random()
      .toString(36)
      .slice(-8);
    if (req.body.email != null) {
      res.user.email = req.body.email;
    }
    res.user.password = randomstring;
    try {
      // this is not working
      const updateuser = await res.user.save();
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "graphite.website.official@gmail.com",
        pass: "graphiteabc123"
      }
    });
    var mailOptions = {
      from: "graphite.website.official@gmail.com",
      to: req.body.email,
      subject: "Reset Passsword",
      text: "Please use this password to Login : " + randomstring
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        res.redirect(
          {
            title: "Graphite",
            home: "active"
          },
          "/"
        );
      }
    });
  }
});

async function getUser(req, res, next) {
  try {
    user = await User.findById(req.params.id);
    if (subscriber == null) {
      return res.status(404).json({ message: "Cant find subscriber" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.subscriber = subscriber;
  next();
}

router.get("/", async (req, res) => {
  res.redirect(
    {
      title: "Graphite",
      home: "active",
      user: req.session.user
    },
    "/"
  );
});

router.get("/register", async (req, res) => {
  res.render("register", {
    title: "Graphite",
    login: "active",
    user: req.session.user
  });
});

router.get("/all", requiresLogin, async (req, res) => {
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
        res.render("login", { title: "Graphite", login: "active", user: null });
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
