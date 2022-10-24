const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  gamesPlayed: {
    type: Array,
  },
});

module.exports = User = mongoose.model("user", userSchema);
