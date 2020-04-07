const express = require("express");
const router = express.Router();
const session = require("express-session");
const User = require("../models/user");
const Counter = require("../models/counter");
const Story = require("../models/story");
const Graph = require("../models/graph");
const Template = require("../models/graph_template");
const bcrypt = require("bcrypt");
const helper = require("./helper.js");
const nodemailer = require("nodemailer");

router.get("/", (req, res) => {
  res.render("index", {
    title: "Graphite",
    home: "active",
    user: req.session.user,
  });
});

// Graphs Zen
router.post("/graphs", async (req, res) => {
  // console.log(req.body);
  if (req.body.graph_ID < 0) {
  }
  console.log(req.body);
  const templates = await Template.find({
    template_ID: req.body.template_ID,
  });
  const stories = await Story.find({ story_ID: req.body.story_ID });

  // console.log(stories);
  // console.log(req.body.story_ID);
  // console.log(req.body.graph_ID);

  var graph_type = templates[0].name;
  if (graph_type.localeCompare("force_directed") == 0) {
    res.render("force_directed");
  } else if (graph_type.localeCompare("bar") == 0) {
    res.render("bar_chart", {
      title: "Graphite",
      graphs: "active",
      user: req.session.user,
      story_ID: req.body.story_ID,
      data: stories,
      template_ID: req.body.template_ID,
      templateData: templates,
      graph_ID: req.body.graph_ID,
    });
  } else {
    res.render("new_graph", {
      title: "Graphite",
      graphs: "active",
      user: req.session.user,
      data: stories,
      template_ID: req.body.template_ID,
      templateData: templates,
      graph_ID: 0,
    });
  }
});

router.get("/forget_password", (req, res) => {
  res.render("forget_password");
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

router.get("/bar_chart", requiresLogin, (req, res) => {
  res.render("bar_chart");
});
router.post("/save_bar_chart", async (req, res) => {
  console.log(req.body.graph_id);
  if (req.body.graph_id >= 0) {
    console.log("Editing" + req.body.graph_id);
    console.log("COLOR : " + req.body.color);
    Graph.findOneAndUpdate(
      { graph_ID: req.body.graph_id },
      { options: req.body.color },
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          res.redirect("/graphs");
        }
      }
    );
    console.log("Editing successful!");
  } else {
    const graph = new Graph({
      user_ID: req.session.user.user_ID,
      // find this - story ID
      story_ID: req.body.story_id,
      template_ID: req.body.template_id,
      graph_ID: req.body.graph_id,
      options: req.body.color,
    });
    try {
      const newGraph = await graph.save();
      res.redirect("/graphs");
    } catch (err) {
      res.render("saved_status", {
        title: "Graphite",
        login: "active",
        message: err.message,
      });
      res.status(400).json({ message: err.message });
    }
  }
});
// END GRAPHS ZEN

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
    var randomstring = Math.random().toString(36).slice(-8);
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
        pass: "graphiteabc123",
      },
    });
    var mailOptions = {
      from: "graphite.website.official@gmail.com",
      to: req.body.email,
      subject: "Reset Passsword",
      text: "Please use this password to Login : " + randomstring,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        res.redirect(
          {
            title: "Graphite",
            home: "active",
          },
          "/"
        );
      }
    });
  }
});

router.get("/counter", async (req, res) => {
  // const counter = new Counter({
  //   _id: "graphID",
  //   seq: 0
  // });
  // try {
  //   const newCounter = await counter.save();
  //   console.log("SAVED!");
  // } catch (err) {
  //   console.log(err.message);
  // }
  try {
    // Mongoose method works by returning all associated subscriber objects that meet its criteria.
    const counters = await Counter.find();
    //return the ^
    res.json(counters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/account", requiresLogin, (req, res) => {
  res.render("account", {
    title: "Graphite",
    account: "active",
    user: req.session.user,
  });
});

router.get("/stories", requiresLogin, async (req, res) => {
  try {
    // Mongoose method works by returning all associated subscriber objects that meet its criteria.
    const stories = await Story.find({ user_ID: req.session.user.user_ID });
    //return the ^
    res.render("stories", {
      title: "Graphite",
      stories: "active",
      user: req.session.user,
      data: stories,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/stories/:function/:id", requiresLogin, async (req, res) => {
  if (req.params.function == "edit") {
    try {
      // Mongoose method works by returning all associated subscriber objects that meet its criteria.
      const story = await Story.find({ story_ID: req.params.id });
      let storyData = helper.reverseJson(JSON.parse(story[0].story));
      //return the ^
      res.render("new_story", {
        title: "Graphite",
        stories: "active",
        user: req.session.user,
        data: storyData,
        story_ID: story[0].story_ID,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else if (req.params.function == "delete") {
    Story.findOneAndDelete({ story_ID: req.params.id }, function (err, result) {
      if (err) {
        res.send(err);
      } else {
        //res.send(result);
      }
    });
    console.log("story deleted!");
    try {
      // Mongoose method works by returning all associated subscriber objects that meet its criteria.
      const stories = await Story.find({ user_ID: req.session.user.user_ID });
      //return the ^
      res.render("stories", {
        title: "Graphite",
        stories: "active",
        user: req.session.user,
        created: "deleted",
        data: stories,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
});

router.get("/new_story", requiresLogin, (req, res) => {
  res.render("new_story", {
    title: "Graphite",
    stories: "active",
    user: req.session.user,
  });
});

router.post("/new_story", requiresLogin, async (req, res) => {
  let json = helper.formatJson(req.body);
  // console.log(json);
  // console.log(req.body.story_ID);
  if (req.body.story_ID >= 0) {
    Story.findOneAndUpdate(
      { story_ID: req.body.story_ID },
      { story: JSON.stringify(json) },
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          //res.send(result);
        }
      }
    );
    console.log("story updated!");
  } else {
    const story = new Story({
      user_ID: req.session.user.user_ID,
      story: JSON.stringify(json),
    });
    try {
      const newStory = await story.save();
      //res.redirect('/stories', { title: 'Graphite', stories: 'active', user: req.session.user});
    } catch (err) {
      res.render("new_story", {
        title: "Graphite",
        stories: "active",
        message: err.message,
      });
      res.status(400).json({ message: err.message });
    }
  }
  try {
    // Mongoose method works by returning all associated subscriber objects that meet its criteria.
    const stories = await Story.find({ user_ID: req.session.user.user_ID });
    //return the ^
    res.render("stories", {
      title: "Graphite",
      stories: "active",
      created: req.body.story_ID >= 0 ? "updated" : "created",
      user: req.session.user,
      data: stories,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/graphs", requiresLogin, async (req, res) => {
  const graphs = await Graph.find({ user_ID: req.session.user.user_ID });
  const templates = await Template.find();
  const stories = await Story.find({ user_ID: req.session.user.user_ID });
  // console.log(graphs);
  res.render("graphs", {
    title: "Graphite",
    graphs: "active",
    user: req.session.user,
    data: graphs,
    templateData: templates,
    storyData: stories,
  });
});

router.post("/new_graph/:template", requiresLogin, async (req, res) => {
  console.log("STORY ID: " + req.body.storyList);
  console.log("TEMPLATE ID: " + req.params.template);

  // change this later 13 - > req.params.template
  const templates = await Template.find({ template_ID: req.params.template });
  const stories = await Story.find({ story_ID: req.body.storyList });

  console.log(stories);
  var graph_type = templates[0].name;
  if (graph_type.localeCompare("force_directed") == 0) {
    res.render("force_directed");
  } else if (graph_type.localeCompare("bar") == 0) {
    res.render("bar_chart", {
      title: "Graphite",
      graphs: "active",
      user: req.session.user,
      story_ID: req.body.storyList,
      data: stories,
      graph_ID: -1,
      template_ID: req.params.template,
      templateData: templates,
    });
  } else {
    res.render("new_graph", {
      title: "Graphite",
      graphs: "active",
      user: req.session.user,
      data: stories,
      template_ID: req.params.template,
      templateData: templates,
    });
  }
});

router.get("/new_graph", requiresLogin, async (req, res) => {
  res.render("new_graph", {
    title: "Graphite",
    graphs: "active",
    user: req.session.user,
  });
});

router.get("/force_directed", (req, res) => {
  res.render("force_directed");
});

// Create one subscriber
router.post("/register", async (req, res) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password,
  });
  try {
    const newUser = await user.save();
    res.redirect("/", {
      title: "Graphite",
      home: "active",
      user: req.session.user,
    });
  } catch (err) {
    res.render("register", {
      title: "Graphite",
      login: "active",
      message: err.message,
    });
    res.status(400).json({ message: err.message });
  }
});

router.post("/login", authenticateUser, async (req, res) => {});

router.get("/login", async (req, res) => {
  res.render("login", {
    title: "Graphite",
    login: "active",
    user: req.session.user,
  });
});

router.get("/", async (req, res) => {
  res.redirect("/", {
    title: "Graphite",
    home: "active",
    user: req.session.user,
  });
});

router.get("/register", async (req, res) => {
  res.render("register", {
    title: "Graphite",
    login: "active",
    user: req.session.user,
  });
});

router.get("/all", async (req, res) => {
  // User.findOneAndUpdate({email: "test3@test.com"}, {user_ID: 4}, function(err, result) {
  //   if (err) {
  //     res.send(err);
  //   } else {
  //     res.send(result);
  //   }
  // });
  try {
    // Mongoose method works by returning all associated subscriber objects that meet its criteria.
    const users = await User.find();
    //return the ^
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/all_stories", async (req, res) => {
  // User.findOneAndUpdate({email: "test3@test.com"}, {user_ID: 4}, function(err, result) {
  //   if (err) {
  //     res.send(err);
  //   } else {
  //     res.send(result);
  //   }
  // });
  try {
    // Mongoose method works by returning all associated subscriber objects that meet its criteria.
    const stories = await Story.find();
    //return the ^
    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/all_templates", async (req, res) => {
  // Template.findOneAndUpdate({name: "tree"}, {description: "Unfortunately, this isn't an actual tree. It's a tree diagram, but they're still pretty cool. :P"}, function(err, result) {
  //   if (err) {
  //     res.send(err);
  //   } else {
  //     res.send(result);
  //   }
  // });
  try {
    // Mongoose method works by returning all associated subscriber objects that meet its criteria.
    const templates = await Template.find();
    //return the ^
    res.json(templates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/logout", async (req, res) => {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
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
      message: "You must be logged in to view this page.",
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
      message: "Please enter an email.",
    });
    return res.status(404).json({ message: "Please enter an email." });
  }
  if (!req.body.password) {
    console.log("first one");
    res.render("login", {
      title: "Graphite",
      login: "active",
      message: "Please enter a password.",
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
      message: "Unknown user.",
    });
    return res.status(404).json({ message: "Unknown user." });
  }
  user.comparePassword(req.body.password, (err, isMatch) => {
    if (err) throw err;
    if (!isMatch) {
      return res.render("login", {
        title: "Graphite",
        login: "active",
        message: "Wrong password.",
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
