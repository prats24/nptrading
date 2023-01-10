const { Server } = require('socket.io');

const io = new Server(9000, {
    cors: {
        origin: 'http://localhost:4000',
        //  origin: "http://3.110.187.5/",
        methods: ['GET', 'POST', 'PATCH'],
      }

});

module.exports = io;