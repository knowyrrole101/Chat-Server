var socket = io();

socket.on('connect', function () {
  console.log("Connected to socket.io server!");
});

socket.on('back-end-msg', function(data){
  console.log(data.text);
});

socket.on('chat-msg', function (data) {
  console.log(data.text);
});

//add this in console on client side!
socket.emit('chat', {text: "Hello Everyone!!!"});
