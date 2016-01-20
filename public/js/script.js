var socket = io();

alertify.defaults.transition = 'zoom';
alertify.defaults.title = 'Selamat datang';
alertify.set('notifier', 'position', 'top-right');

// alertify.defaults.theme.ok = 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent';
alertify.defaults.theme.cancel = 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect';

socket.on('connect', function(msg) {
  console.log(msg);
  alertify.prompt('Masukkan nama anda', 'Joko', function(evt, value) {
    socket.emit('join', { nama: value, color: randomColor() });
    alertify.success('Selamat datang ' + value);
    localStorage.setItem('nama', value);
  },

  function() {
    socket.emit('join', 'Joko');
    localStorage.setItem('nama', 'Joko');
    alertify.error('nama default anda Joko');
  }).setHeader('Selamat Datang!');

});

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

// var container = $('.container-messages');

// ON SUBMIT DATA DI KIRIM KE SERVER
$('form').submit(function() {
  socket.emit('chat message', { nama: localStorage.getItem('nama'), pesan: bf.encrypt($('#message').val()) });
  $('#message').val('');

  window.setInterval(function() {
    var elem = document.getElementsByClassName('container-messages');
    elem[0].scrollTop = elem[0].scrollHeight;
  }, 500);

  // container = container.scrollHeight;
  return false;
});

// KETIKA ADA DATA BERUBAH LANGSUNG BUAT ELEMEN BARU
socket.on('chat message', function(data) {
  console.log(data);
  $('#messages').append(`<div class="mdl-card mdl-shadow--2dp">
  <div class="mdl-card__title mdl-card--expand">
    <p> <strong><em style="color:${data[data.length - 1].result.color}"> ${data[data.length - 1].result.detail.nama} &nbsp; : &nbsp;</em></strong> ${data[data.length - 1].result.detail.pesan} </p>
  <p class="end"> ${data[data.length - 1].result.waktu} </p>
  </div> </div>`);
  $('#messages').smilify();
});

socket.on('join', function(data) {
  console.log(`${data.nama} Join`);
  alertify.success(`${data.nama} ikut nimbrung`);
  alertify.success(`${data.online} user online`);

  // $('#messages').append(`<p class="joined"><em> ${nama} ikut nimbrung </em></p>`);
});

socket.on('disconnect', function(data) {
  console.log(`${data.nama} DC`);
  if (data.nama != null) {
    alertify.error(`${data.nama} berhasil kabur`);
    alertify.error(`${data.online} user online`);

    // $('#messages').append(`<p class="disconnect"><em> ${nama} berhasil kabur  </em></p>`);
  }

});

//TYPING

var typing = false;
var timeout = undefined;

function timoutFunction() {
  typing = false;
  socket.emit('typing', false);
};

$('#message').keypress(function(e) {
  if (e.which !== 13) {
    if (typing === false && $('#message').is(':focus')) {
      typing = true;
      console.log('typing');
      socket.emit('typing', { status: true, nama: localStorage.getItem('nama') });
    } else {
      clearTimeout(timeout);
      timeout = setTimeout(timoutFunction, 1500);
    }
  }

  // if (e.which === 13) {
  //   $('.typing').remove();
  // }
});

socket.on('typing', function(data) {
  if (data.status) {
    console.log(`${data.nama} is typing ..`);
    $('#messages').append(`<p class="typing"><em> ${data.nama} lagi ngetik ..  </em></p>`);
    timeout = setTimeout(timoutFunction, 1500);
  } else {
    $('.typing').remove();
  }
});
