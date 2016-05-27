var socket = io();

socket.on('connect', function () {
  console.log('Connected to socket.io server!');
});

socket.on('message', function(data){
  console.log(data.text);
  console.log(data.timestamp);
  jQuery('.messages').append('<p><strong>'+data.timestamp+' : </strong>'+data.text+'</p>');
});

var $form = jQuery('#message-form');

$form.on('submit', function(e) {
  e.preventDefault();
  var $message = $form.find('input[name=message]');
  socket.emit('message', {
    text: $message.val()
  });
  //empty form
  $message.val('');
});
