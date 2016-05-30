var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
//Tells Node Server use Express App as Boilerplate
var http = require('http').Server(app);
//Format Socket.io expects
var io = require('socket.io')(http);
var moment = require('moment');
//Serve Static Files
app.use(express.static(__dirname + '/public'));

var client_info = {};

io.on('connection', function (socket) {
  console.log('User connected via socket.io');
  var now_timestamp = moment().local().format('h:mm:ss a');
  socket.emit('message', {
    name: "System",
    text: "Welcome to the chat application",
    timestamp: now_timestamp
    //timestamp property
  });

  socket.on('join_room', function (req) {
    var now_timestamp = moment().local().format('h:mm:ss a');
    client_info[socket.id] = req;
    socket.join(req.room);
    socket.broadcast.to(req.room).emit('message', {
      name: 'System',
      text: req.name + ' has joined!',
      timestamp: now_timestamp
    });
  });

  socket.on('message', function (data) {
    var now_timestamp = moment().local().format('h:mm:ss a');
    console.log(now_timestamp);
    console.log(data.text);
    data.timestamp = now_timestamp;
    //broadcast sends to everyone except person who sent
    //socket.broadcast.emit()
    io.to(client_info[socket.id].room).emit('message', data);
    //timestamp property
  });




});



http.listen(PORT, function () {
  console.log("Socket.io server started!");
});
