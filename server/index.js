const express = require('express');
var cors = require('cors')
const http = require('http');
const socket = require('socket.io');

const port = 3001

var app = express();
app.use(cors())
const server = http.createServer(app)
const io = socket(server)


io.on('connection', function (socket) {
    socket.on('joined', function (uuid) {
      console.log(`${uuid} connected`)
    });

    socket.on('MOVE', function (moveLocation, currentLocation) {
        socket.broadcast.emit("MOVE", moveLocation, currentLocation);
    }); 
});

server.listen(port);
console.log('listening on port 3001');