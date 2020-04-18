const mongoose = require("mongoose");
const Counter = require("./counter");

const StorySchema = new mongoose.Schema({
    user_ID: {
        type: Number,
        default: 0
      },
    story_ID: {
        type: Number,
        default: 0,
    },
    story: {
        type: String,
        required: true
      },
    dateCreated: {
      type: Date,
    },
    dateEdited: {
      type: Date,
    },
  });

StorySchema.pre("save", function(next) {
  let story = this;
  story.dateCreated = new Date();
  story.dateEdited = new Date();
  Counter.findByIdAndUpdate({_id: 'storyID'}, {$inc: { seq: 1} }, function(error, Counter) {
    if(error) return next(error);
    story.story_ID = Counter.seq;
    next();
  });
});

module.exports = mongoose.model("Story", StorySchema);