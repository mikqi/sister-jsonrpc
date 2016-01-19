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
  }).setHeader('Selamat Datang!');

// BLOWFISH
var bf = new Blowfish('some key');
var ciphertext = bf.encrypt('some plaintext');
var plaintext = bf.decrypt(ciphertext);
console.log(ciphertext);
console.log(plaintext);

var team = `
<ul>
  <li class="nama-team"> Muhammad Rivki <span class="nim-team"> 10112582 </span></li>
  <li class="nama-team"> Mohammad Febri Ramadlan<span class="nim-team"> 10112695 </span></li>
  <li class="nama-team"> Hafizha Husnaisa <span class="nim-team"> 10112775 </span></li>
  <li class="nama-team"> Rosmaya Nurbayanti <span class="nim-team"> 10112803 </span></li>
</ul>
`;

$('.info').on('click', function() {
  console.log('clicked');
  alertify.alert(team).setHeader('Anggota Kelompok').set({ movable: false });
});

var socket = io();

// ON SUBMIT DATA DI KIRIM KE SERVER
$('form').submit(function() {
  socket.emit('chat message', { nama: localStorage.getItem('nama'), pesan: bf.encrypt($('#message').val()) });
  $('#message').val('');
  return false;
});

// KETIKA ADA DATA BERUBAH LANGSUNG BUAT ELEMEN BARU
socket.on('chat message', function(data) {
  console.log(data);
  $('#messages').append(`<div class="mdl-card mdl-shadow--2dp">
  <div class="mdl-card__title mdl-card--expand">
    <p> <strong><em> ${data[data.length - 1].result.detail.nama} &nbsp; : &nbsp;</em></strong> ${bf.decrypt(data[data.length - 1].result.detail.pesan).replace(/0/g, '')} </p>
  <p class="end"> ${data[data.length - 1].result.waktu} </p>
  </div> </div>`);

});

socket.on('news', function(data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });
