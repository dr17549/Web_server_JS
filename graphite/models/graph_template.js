const mongoose = require("mongoose");
const Counter = require("./counter");

const TemplateSchema = new mongoose.Schema({
    user_ID: {
        type: Number,
        default: 0
      },
    template_ID: {
        type: Number,
        default: 0,
    },
    name: {
        type: String,
        required: true,
        unique: 1,
      },
    description: {
      type: String,
      required: true,
    }
  });

TemplateSchema.pre("save", function(next) {
  let template = this;
  Counter.findByIdAndUpdate({_id: 'templateID'}, {$inc: { seq: 1} }, function(error, Counter) {
    if(error) return next(error);
    template.template_ID = Counter.seq;
    next();
  });
});

module.exports = mongoose.model("Template", TemplateSchema);