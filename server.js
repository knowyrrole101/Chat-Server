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

io.on('connection', function (socket) {
  console.log('User connected via socket.io');
  var now_timestamp = moment().local().format('h:mm:ss a');
  socket.emit('message', {
    name: "System",
    text: "Welcome to the chat application",
    timestamp: now_timestamp
    //timestamp property
  });

  socket.on('message', function (data) {
    var now_timestamp = moment().local().format('h:mm:ss a');
    console.log(now_timestamp);
    console.log(data.text);
    data.timestamp = now_timestamp;
    //broadcast sends to everyone except person who sent
    //socket.broadcast.emit()
    io.emit('message', data);
    //timestamp property
  });

});



http.listen(PORT, function () {
  console.log("Socket.io server started!");
});
