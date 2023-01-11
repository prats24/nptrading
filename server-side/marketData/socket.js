const { Server } = require("socket.io");

const io = new Server(3000, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST', 'PATCH'],
    },
  });

io.on("connection", (socket) => {
  // ...
  console.log(socket.id);
});