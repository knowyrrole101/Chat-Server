var socket = io();

socket.on('connect', function () {
  console.log('Connected to socket.io server!');
});

socket.on('message', function(data){
  console.log(data.text);
  jQuery('.messages').append('<p>'+ data.text +'</p>')
});

var $form = jQuery('#message-form');

$form.on('submit', function(e) {
  e.preventDefault();
  var $message = $form.find('input[name=message]');
  socket.emit('message', {
    //pulls value out of form
    text: $message.val()
  });
  $message.val('');
});
