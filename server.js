var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
//Tells Node Server use Express App as Boilerplate
var http = require('http').Server(app);
//Format Socket.io expects
var io = require('socket.io')(http);
//Serve Static Files
app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
  console.log('User connected via socket.io');

  socket.emit('message', {
    text: "Welcome to the chat application"
  });

  socket.on('message', function (data) {
    console.log(data.text);
    socket.broadcast.emit('message', data);
  });

});



http.listen(PORT, function () {
  console.log("Socket.io server started!");
});
