const express = require("express");
const router = express.Router();
const Subscriber = require("../models/subscriber");

// Get all subscribers
router.get("/", async (req, res) => {
  try {
    // Mongoose method works by returning all associated subscriber objects that meet its criteria.
    const subscribers = await Subscriber.find();
    //return the ^
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  res.send("hello world");
});

// Get one subscriber
router.get("/:id", getSubscriber, (req, res) => {
  res.json(res.subscriber);
});

// Create one subscriber
router.post("/", async (req, res) => {
  const subscriber = new Subscriber({
    name: req.body.name,
    subscribedChannel: req.body.subscribedChannel
  });

  try {
    const newSubscriber = await subscriber.save();
    res.status(201).json(newSubscriber);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update one subscriber
// Update Subscriber

router.patch("/:id", getSubscriber, async (req, res) => {
  if (req.body.name != null) {
    res.subscriber.name = req.body.name;
  }

  if (req.body.subscribedChannel != null) {
    res.subscriber.subscribedChannel = req.body.subscribedChannel;
  }
  try {
    const updatedSubscriber = await res.subscriber.save();
    res.json(updatedSubscriber);
  } catch {
    res.status(400).json({ message: err.message });
  }
});

// Delete
router.delete("/:id", getSubscriber, async (req, res) => {
  try {
    await res.subscriber.remove();
    res.json({ message: "Deleted This Subscriber" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getSubscriber(req, res, next) {
  try {
    //Mongo reads the JSON stores as object directly
    subscriber = await Subscriber.findById(req.params.id);
    if (subscriber == null) {
      return res.status(404).json({ message: "Cant find subscriber" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.subscriber = subscriber;
  //allows the code to move on to the next part of the code
  next();
}

module.exports = router;
