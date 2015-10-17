var express = require('express');
var app = express();
var socket = require('socket.io');
var _ = require('underscore');
var server = app.listen(9004);
var io = socket.listen(server);


app.get('/', function(request, response){
  response.sendfile(__dirname + "/index.html");
});

app.use(express.static(__dirname));
app.use(express.static(__dirname + "/client"));

var Whiz = {
  clientsCount: 0,
  clientsArray: [],
  ballPosition: 0,
  slapsCount: 0,
  timeBetweenSlaps: 8000,
  timeToNewGame: 1000,
  getPlayerPosition: function (socketId) {
    // console.log(Whiz.clientsArray.lastIndexOf(socketId) + 1);
    return Whiz.clientsArray.lastIndexOf(socketId) + 1;
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
    Whiz.slapsCount = 0;
    io.sockets.emit('wait-for-restart', Whiz.timeToNewGame) // time
  }
};

_.delay(function () {
  Whiz.changeBall(1);
},500);

io.sockets.on('connection', function(socket) {
  var socketId = socket.id;
  Whiz.clientsCount = Whiz.clientsCount + 1;
  Whiz.clientsArray.push(socket.id);

  console.log('--------')
  _.each(Whiz.clientsArray, function (clientId) {
    // console.log(socket.id == clientId);
    console.log(clientId)
    console.log(Whiz.clientsArray.lastIndexOf(clientId) + 1);
    io.sockets.connected[clientId].emit('new-player', {
      playersCount: Whiz.clientsCount,
      playerPosition: Whiz.getPlayerPosition(clientId)
    });
  })

  socket.on('ball-slap', function(nextPosition) { // Num
    Whiz.onBallSlap(nextPosition);
  });

  socket.on('times-up', function () {
    Whiz.onTimesUp();
  });

  socket.on('disconnect', function() {
    Whiz.clientsCount = Whiz.clientsCount - 1;
    console.log('client disconnected!');
    Whiz.clientsArray = _.without(Whiz.clientsArray, socket.id);
  });
});
