const express = require("express");
const router = express.Router();
const { createRoom } = require("../controllers/game");

router.post("/create-game", createRoom);

module.exports = router;
