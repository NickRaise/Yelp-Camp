const mongoose = require("mongoose");
const passportLocalMongooose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true,
  },
});

userSchema.plugin(passportLocalMongooose);

module.exports = mongoose.model("User", userSchema);
