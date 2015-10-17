function socketCommands() {
  var ipurl = '192.168.3.234:9004';
  var socket = io.connect(ipurl);

  socket.emit('my-msg', 'param');
}

var onNewPlayer = function(cb) {
	socket.on('new-player', cb );
}

function onBallChanged(cb) {
	socket.on('ball-changed', cb);
}

function timesUp(player) {
	socket.emit('times-up', {
		player: player
	);
}

function slapBall(nextPos) {
	socket.emit('ball-slap', nextPos);
}
