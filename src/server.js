const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const publicPath = path.join(__dirname, './../public');
const port = process.env.PORT || 3000;

var {playerCheck, holdMemory} = require('./playerHold.js');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));
app.set('view engine', 'html');

app.get('/', (req, res) => {
  res.render("index.html");
});
//game page to render for players in use...
app.get('/gamepage', (req, res) => {
  res.sendFile('gamepage.html', { root: path.join(__dirname, './../public') });
});
//socket for game page ## RECONNECTS ONLY TWO TO ROOM THEN MAKES NEW ROOM ##
//This is the main connect for game plage then sends the room to client side for
//actually playing game
//global var so it dosent reset .. need to add memory manager to var...
var random = 0;
io.of('/gamepage').on('connection', (sockets) => {
  console.log("Game page connected");
  var room = 'gameRoom';
  var mainRoom = room + random.toString();
  sockets.join(mainRoom);
  var checkRoom = sockets.adapter.rooms[mainRoom];
  if(checkRoom.length < 2) {
    sockets.join(mainRoom);
    //io.of('/gamepage').
    sockets.broadcast.in(mainRoom).emit('gameplay', mainRoom);
  }
  else if (checkRoom.length == 2) {
    sockets.join(mainRoom);
    io.of('/gamepage').in(mainRoom).emit('gameplay', mainRoom);
    random += 1;
  } else {
    console.log("Error joining room");
  }
      //this is to recieve and send player updates
      //io.of('/gamepage').
      sockets.on('updateplayer', (player) => {
        io.of('/gamepage').in(mainRoom).emit("playerupdate", player);
        //socket.broadcast.to(mainRoom).emit('playerupdate', player);
      });
      sockets.on('getxandy', (playerx, playery) => {
        io.of('/gamepage').in(mainRoom).emit('sendplayerxandy', playerx, playery)
      });

});

io.on('connection', (socket) => {
  console.log("New User Connected");
//login method to check username and validation to wait for other users.
  socket.on('userName', (userName, callback) => {
    var errMess = "";
    if(userName == "" || userName == null) {
      errMess = "Enter Valid UserName";
      socket.emit('UserNameError', errMess);
    }
    //check if username avalible
    else if(!playerCheck(userName)) {
      errMess = "UserName is Taken";
      socket.emit('UserNameError', errMess);

    } else {
      //if all test pass push user to game room!
      errMess = "";
      socket.emit('UserNameError', errMess);
      socket.emit('incoming', userName);
      //push to gameRoom
      playerToRoom(socket.id, userName);
    }
    callback();
  });
//function to put players in a Room
//only lets two people join a Room
var playerToRoom = (id, username) => {
  //game room
  var gameRoom = 'gameRoom';
  //control holdMemory
  holdMemory(username);
  socket.join(gameRoom);
  var room = io.sockets.adapter.rooms[gameRoom];
  //only send to game if there are two people BREAKS CONNECTION!!
  if(room.length >= 2) {
    io.sockets.in(gameRoom).emit('newMessage', 'Match Loading...');
    //call game page...
    var send = () => { return io.sockets.in(gameRoom).emit('changeRoom', "gamepage");};
    //set time out for visual match loading idk why...
    setTimeout(send, 1500);
  } else {
    //if no players wait...
    io.sockets.in(gameRoom).emit('newMessage', "Waiting for players...");
  }

}

  socket.on('disconnect', () => {
    console.log("User was disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
