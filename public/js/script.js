alertify.defaults.transition = 'zoom';
alertify.defaults.title = 'Selamat datang';
alertify.set('notifier', 'position', 'top-right');

// alertify.defaults.theme.ok = 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent';
alertify.defaults.theme.cancel = 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect';
alertify.prompt('Masukkan nama anda', 'Joko', function(evt, value) {
    alertify.success('Selamat datang ' + value);
    localStorage.setItem('nama', value);
  },

  function() {
    localStorage.setItem('nama', 'default');
    alertify.error('nama default anda default');
  });

$('.ajs-header')[0].innerHTML = 'Selamat Datang!';

var socket = io();

// ON SUBMIT DATA DI KIRIM KE SERVER
$('form').submit(function() {
  socket.emit('chat message', { nama: localStorage.getItem('nama'), pesan:$('#message').val() });
  $('#message').val('');
  return false;
});

// KETIKA ADA DATA BERUBAH LANGSUNG BUAT ELEMEN BARU
socket.on('chat message', function(data) {
  console.log(data);
  $('#messages').append(`<div class="mdl-card mdl-shadow--2dp">
  <div class="mdl-card__title mdl-card--expand">
    <p> <strong><em> ${data[data.length - 1].result.detail.nama} &nbsp; : &nbsp;</em></strong> ${data[data.length - 1].result.detail.pesan} </p>
  <p class="end"> ${data[data.length - 1].result.waktu} </p>
  </div> </div>`);

});

socket.on('news', function(data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });
