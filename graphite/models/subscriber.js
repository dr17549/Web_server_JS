// Subscriber model/object while subscribers.js will handle the routes called from the Front-end
const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  subscribedChannel: {
    type: String,
    required: true
  },
  subscribeDate: {
    type: Date,
    required: true,
    default: Date.now
  }
});
//mongoose exports the model to the MongoDB 
module.exports = mongoose.model("Subscriber", subscriberSchema);
