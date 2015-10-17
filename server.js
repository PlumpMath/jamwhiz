var express = require('express');
var app = express();
var socket = require('socket.io');
var server = app.listen(9004);
var io = socket.listen(server);


app.get('/', function(request, response){
  response.sendfile(__dirname + "/index.html");
});

app.use(express.static(__dirname));
app.use(express.static(__dirname + "/client"));

var Whiz = {
  clientsCount: 0,
  ballPosition: 0,
  slapsCount: 0,
  timeBetweenSlaps: 1000,
  timeToNewGame: 1000,
  getNewPlayerPosition: function () {
    console.log('New player in poisition ' + Whiz.clientsCount);
    return Whiz.clientsCount;
  },
  onBallSlap: function (nextPosition) {
    console.log('ball Slapped to ' + nextPosition);
    Whiz.changeBall(nextPosition);
  },
  changeBall: function (nextPosition) {
    Whiz.slapsCount = Whiz.slapsCount + 1;

    io.sockets.emit('ball-changed', {
      currentPosition: nextPosition,
      positionBefore: Whiz.ballPosition,
      timeToNextPosition: Whiz.timeBetweenSlaps,
      count: Whiz.slapsCount
    });

    Whiz.ballPosition = nextPosition
  },
  onTimesUp: function () {
    console.log('Times Up!');
    io.sockets.emit('wait-for-restart', Whiz.timeToNewGame) // time
  }
};

io.sockets.on('connection', function(socket) {
  Whiz.clientsCount = Whiz.clientsCount + 1;
  socket.emit('new-player', Whiz.getNewPlayerPosition());

  socket.on('ball-slap', function(nextPosition) { // Num
    Whiz.onBallSlap(nextPosition);
  });
});

io.sockets.on('disconnection', function(socket) {
  Whiz.clientsCount = Whiz.clientsCount - 1;
});
