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

//Sends current users to provided socket
function send_current_users (socket) {
  var info = client_info[socket.id];
  var users = [];
  var now_timestamp = moment().local().format('h:mm:ss a');

  if (typeof info === 'undefined') {
    return;
  }

  Object.keys(client_info).forEach(function (socket_id) {
    var user_info = client_info[socket_id];
    if (info.room === user_info.room) {
      users.push(user_info.name);
    }
  });

  socket.emit('message', {
    name: 'System',
    text: 'Current Users: '+ users.join(', '),
    timestamp: now_timestamp
  });
}

io.on('connection', function (socket) {
  console.log('User connected via socket.io');
  var now_timestamp = moment().local().format('h:mm:ss a');
  socket.emit('message', {
    name: "System",
    text: "Welcome to the chat application",
    timestamp: now_timestamp
    //timestamp property
  });

  //disconnect matters here. built in socket event
  socket.on('disconnect', function () {
    var now_timestamp = moment().local().format('h:mm:ss a');
    var user_data = client_info[socket.id];
    if(typeof user_data !== 'undefined'){
      socket.leave(user_data.room);
      io.to(user_data.room).emit('message', {
        name: "System",
        text: user_data.name+" has left the chat!",
        timestamp: now_timestamp
      });
      delete client_info[socket.id];
    }
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
    //custom code
    if (data.text === '@current_users'){
      send_current_users(socket);
    } else {
      io.to(client_info[socket.id].room).emit('message', data);
    }
    //broadcast sends to everyone except person who sent
    //socket.broadcast.emit()
  });
});

http.listen(PORT, function () {
  console.log("Socket.io server started!");
});
