
var name = getQueryVariable('name')|| 'Anonymous';
var room = getQueryVariable('room');
var socket = io();

console.log(name + ', wants to join: '+ room +' chatroom!');
jQuery('.room-title').text(room);

socket.on('connect', function () {
  console.log('Connected to socket.io server!');
  socket.emit('join_room', {
    name: name,
    room: room
  });
});

socket.on('message', function(data){
  console.log(data.text);
  console.log(data.timestamp);
  var $messages = jQuery('.messages');
  var $message = jQuery("<li class='list-group-item'></li>");
  $message.append('<p><strong>'+ data.name + '  '+ data.timestamp + '</strong></p>')
  $message.append('<p>' + data.text + '</p>');
  $messages.append($message);
});

var $form = jQuery('#message-form');

$form.on('submit', function(e) {
  e.preventDefault();
  var $message = $form.find('input[name=message]');
  socket.emit('message', {
    name: name,
    text: $message.val()
  });
  //empty form
  $message.val('');
});
