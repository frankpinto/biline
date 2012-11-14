socket.on('waiting', function (res) {
  var waitingMessage = document.createElement('span');
  waitingMessage.innerHTML = res.message;
  waitingMessage.className = 'waiting-message';
  document.body.appendChild(waitingMessage);
});

socket.on('foundPartner', function () {
  var waitingMessage = document.getElementsByClassName('waiting-message')[0];
  waitingMessage.parentNode.removeChild(waitingMessage);
});
