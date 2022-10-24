const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");
const Game = require("../models/Game");
const { MARKING_OBJ } = require("../plottingObj");

exports.createRoom = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email }).select("-password");
    const initializeMatrix = Array.from({ length: 9 }).map(() => {
      return -1;
    });
    const newGame = Game({
      roomId: uuidv4(),
      participants: [user.email],
      matrix: initializeMatrix,
      winner: null,
      previousMove: null,
    });
    await newGame.save();
    res.status(200).json({ message: "GAME_ROOM_CREATED", game: newGame });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error" });
  }
};

exports.UTILITY_FUNCTIONS = {
  joinroom: async function ({ email, roomId }) {
    try {
      const game = await Game.findOne({ roomId });
      if (game.participants.filter((e) => e === email).length === 0) {
        game.participants.push(email);
        await game.save();
      }
      return { message: "GAME_ROOM_JOINED" };
    } catch (err) {
      console.log(err);
    }
  },

  movemade: async function ({ email, roomId, index }) {
    try {
      const game = await Game.findOne({ roomId });
      const matchedSquares = MARKING_OBJ[index];

      if (game.participants.filter((e) => e === email).length === 1) {
        // preventing two successive attempts by the same email
        if (email !== game.previousMove) {
          game.matrix[index] = game.selectedMoves[email];

          for (let i = 0; i < matchedSquares.length; i++) {
            const [frstIndex, scndIndex] = matchedSquares[i];
            if (
              game.matrix[frstIndex] === game.matrix[scndIndex] &&
              game.matrix[frstIndex] === game.matrix[index] &&
              game.matrix[index] === game.selectedMoves[email]
            ) {
              game.winner = email;
              console.log(`Matched! ${email} won the game!!`);
              console.log(index, frstIndex, scndIndex);
              game.previousMove = email;
              await game.save();
              return {
                message: "MOVE_MADE",
                winner: email,
                winningSquares: [index, frstIndex, scndIndex],
                matrix: game.matrix,
              };
            }
          }
          game.previousMove = email;
          await game.save();
        } else {
          console.log("succesive move detected!");
        }
      }
      return {
        message: "MOVE_MADE",
        winner: null,
        winnigSquares: [],
        matrix: game.matrix,
      };
    } catch (err) {
      console.log(err);
    }
  },

  choosemove: async function ({ email, roomId, move }) {
    try {
      const game = await Game.findOne({ roomId });
      if (game.selectedMoves) {
        if (!Object.values(game.selectedMoves).includes(move)) {
          if (
            game.selectedMoves[email] === 0 ||
            game.selectedMoves[email] === 1
          ) {
            console.log("Invalid! Move already added for ", email);
            return game.selectedMoves;
          } else {
            const tempMoveObj = {
              ...game.selectedMoves,
              [email]: move,
            };
            game.selectedMoves = tempMoveObj;
            await game.save();
            return game.selectedMoves;
          }
        } else {
          console.log(move, "is already selected");
        }
      } else {
        const tempMoveObj = {
          [email]: move,
        };
        game.selectedMoves = tempMoveObj;
        await game.save();
        return game.selectedMoves;
      }
    } catch (err) {
      console.log(err);
    }
  },

  resetGame: async function ({ roomId }) {
    try {
      const game = await Game.findOne({ roomId });
      const initializeMatrix = Array.from({ length: 9 }).map(() => {
        return -1;
      });
      game.matrix = initializeMatrix;
      game.selectedMoves = {};
      game.previousMove = null;
      await game.save();
    } catch (err) {
      console.log(err);
    }
  },
};
