
var name = getQueryVariable('name')|| 'Anonymous';
var room = getQueryVariable('room');
var socket = io();

console.log(name + ', wants to join: '+ room +' chatroom!');
jQuery('.room-title').text(room);

socket.on('connect', function () {
  console.log('Connected to socket.io server!');

});

socket.on('message', function(data){
  console.log(data.text);
  console.log(data.timestamp);
  var $message = jQuery('.messages');
  $message.append('<p><strong>'+ data.name + '  '+ data.timestamp + '</strong></p>')
  $message.append('<p>' + data.text + '</p>');
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
