const mongoose = require("mongoose");

const gameSchema = mongoose.Schema({
  roomId: {
    type: String,
  },
  participants: {
    type: Array,
  },
  matrix: {
    type: Array,
  },
  selectedMoves: {
    type: Object,
  },
  winner: {
    type: String || null,
  },
  previousMove: {
    type: String || null,
  },
});

module.exports = Game = mongoose.model("Game", gameSchema);
