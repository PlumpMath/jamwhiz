function socketCommands() {
  var ipurl = '192.168.3.234:9004';
  socket = io.connect(ipurl);
}

function onNewPlayer(cb) {
	socket.on('new-player', cb );
}

function onBallChanged(cb) {
	socket.on('ball-changed', cb);
}

function timesUp(player) {
	socket.emit('times-up', player);
}

function slapBall(nextPos) {
	socket.emit('ball-slap', nextPos);
}


