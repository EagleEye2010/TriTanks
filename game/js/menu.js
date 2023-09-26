var username = {};
var users = {};

function battle() {
  username.name = document.getElementById('username').value;
  username.room = document.getElementById('room').value;
  let index = document.getElementById('tank').selectedIndex;
  console.log(index);
  username.type = document.getElementById('tank')[index].value;
  username.type = username.type.toLowerCase();
  join();
}

function info() {
  document.getElementById('guide').style.visibility = 'visible';
}

function openChat() {
  document.getElementById('chat').style.visibility = 'visible';
  document.getElementById('chat-input').style.visibility = 'visible';
}

function closeChat() {
  document.getElementById('chat').style.visibility = 'hidden';
  document.getElementById('chat-input').style.visibility = 'hidden';
}

function sendChat() {
  let data = document.getElementById('chat-input').value;
  socket.emit('chat',data);
}