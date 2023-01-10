const { Server } = require("socket.io");

const io = new Server(4000, {
    cors: {
      origin: 'http://localhost:4000',
      methods: ['GET', 'POST', 'PATCH'],
    },
  });

io.on("connection", (socket) => {
  // ...
  console.log(socket.id);
});