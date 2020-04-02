const mongoose = require("mongoose");
const Counter = require("./counter");

const GraphSchema = new mongoose.Schema({
    user_ID: {
        type: Number,
        default: 0
      },
    story_ID: {
        type: Number,
        default: 0,
    },
    template_ID: {
        type: Number,
        default: 0,
    },
    graph_ID: {
        type: Number,
        default: 0,
    },
    options: {
        type: String,
        required: true
      },
  });

GraphSchema.pre("save", function(next) {
  let graph = this;
  Counter.findByIdAndUpdate({_id: 'graphID'}, {$inc: { seq: 1} }, function(error, Counter) {
    if(error) return next(error);
    graph.graph_ID = Counter.seq;
    next();
  });
});

module.exports = mongoose.model("Graph", GraphSchema);