var express = require('express');
var app = express();
var socket = require('socket.io');
var server = app.listen(9004);
var io = socket.listen(server);


app.get('/', function(request, response){
  response.sendfile(__dirname + "/index.html");
});
