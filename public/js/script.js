var socket = io();
$('form').submit(function() {
  socket.emit('chat message', $('#message').val());
  $('#message').val('');
  return false;
});

socket.on('chat message', function(msg) {
  console.log(msg);
  $('#messages').append('<div class="mdl-card mdl-shadow--2dp"> <div class="mdl-card__title mdl-card--expand"> <p>' + msg[msg.length - 1].result.pesan + '</p><p class="end">' + msg[msg.length - 1].result.waktu + '</p> </div> </div>');

});

socket.on('news', function(data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });
