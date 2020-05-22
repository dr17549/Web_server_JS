const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");
const Counter = require("./counter");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: 1,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  user_ID: {
    type: Number,
    default: 0,
  },
  access: {
    type: Number,
    default: 0,
  },
});

// userSchema.pre("update", function (next) {
//   bcrypt.hash(this.password, 10, function (err, hash) {
//     if (err) return next(err);
//     this.password = hash;
//     next();
//   });
// });

userSchema.pre("save", function (next) {
  console.log("PRESAVE");
  let user = this;

  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    console.log(hash);
    user.password = hash;
    next();
  });
});

userSchema.statics.authenticate = function (email, password, callback) {
  user.findOne({ email: email }).exec(function (err, user) {
    if (err) {
      return callback(err);
    } else if (!user) {
      var err = new Error("User not found.");
      err.status = 401;
      return callback(err);
    }
    bcrypt.compare(password, user.password, function (err, result) {
      if (result === true) {
        return callback(null, user);
      } else {
        return callback();
      }
    });
  });
};
userSchema.methods.comparePassword = function (
  candidatePassword,
  checkpassword
) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return checkpassword(err);
    checkpassword(null, isMatch);
  });
};

module.exports = mongoose.model("Subscriber", userSchema);
