const { UTILITY_FUNCTIONS } = require("./controllers/game");

const socket_connection = ({ io }) => {
  io.on("connection", (socket) => {
    console.log("connected..", socket.id);

    socket.on("joinroom", (params) => {
      //   console.log(params);
      UTILITY_FUNCTIONS.joinroom({ ...params }).then((res) => {
        if (res) {
          console.log(params.email, "joined room", params.roomId);
          socket.join(params.roomId);
        }
      });
    });

    socket.on("choosemove", (params) => {
      UTILITY_FUNCTIONS.choosemove({ ...params }).then((res) => {
        console.log(
          params.email,
          "chooses",
          params.move === 0 ? "✔" : "❌",
          "in",
          params.roomId
        );
      });
      io.to(params.roomId).emit("choosemove", params);
    });

    socket.on("movemade", (params) => {
      UTILITY_FUNCTIONS.movemade({ ...params }).then((res) => {
        if (res) {
          console.log(`move made by ${params.email} in ${params.roomId}`);
          io.to(params.roomId).emit("movemade", res);
        }
      });
    });

    socket.on("reset", (params) => {
      UTILITY_FUNCTIONS.resetGame({ ...params });
    });
  });
};

module.exports = socket_connection;
