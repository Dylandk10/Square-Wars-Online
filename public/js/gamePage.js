var socket = io.connect('http://localhost:3000/gamepage');
socket.on('connect', function(sockets) {
  //give each game room specific string
  socket.on('gameplay', function(room) {
    console.log("Room: " + room);
    //global vars
    var gamePlaying, player, otherPlayer;

    var startGame = () => {
      //make and send player
      player = new Player('xxx', 30, 30, 50, 268, 'red');
      socket.emit("updateplayer", player);
      socket.on('playerupdate', function(otherplayer) {
      //get other playeronce
      otherPlayer = new Player(otherplayer.name, otherplayer.width, otherplayer.height, otherplayer.x, otherplayer.y, otherplayer.color);
      });
      gamePlaying = true;
      myGameArea.start();
    }
//create game area
    var myGameArea = {
      canvas: document.createElement('canvas'),
      start: function() {
        this.canvas.width = 600;
        this.canvas.height = 320;
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(this.canvas, document.body.childNodes[2]);
        this.framNo = 0;
        this.interval = setInterval(updateGameArea, 400);
        //key down to go
        window.addEventListener("keyup", function(e) {
          myGameArea.key = false;
        })
        window.addEventListener("keydown", function(e) {
          myGameArea.key = e.keyCode;
        })
      },
      //clear the canvas and update
      clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }

    //function to calc framNo
    var everyInterval = (n) => {
      if ((myGameArea.framNo / n) % 1 === 0) {
        return true;
      }
      return false;
    }
//player constructor
    class Player {
      constructor(name, width, height, x, y, color) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.x = x;
        this.y = y;
        this.color = color;
      }
      update() {
        let ctx = myGameArea.context;
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
      newPos() {
        this.x += this.speedX;
        this.y += this.speedY;
      }
      crashWith(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
          crash = false;
        }
        return crash;
      }
    }

    //game area always updating every 20min sec ...
    var updateGameArea = () => {
      //recieve other player x and y super super laggy...
      socket.emit('getxandy', player.x, player.y);
      socket.on('sendplayerxandy', function(playx, playy) {
        otherPlayer.x = playx;
        otherPlayer.y = playy;
      });

      //send this play
      if (gamePlaying) {

        myGameArea.clear();
        player.speedX = 0;
        player.speedY = 0;
        if (myGameArea.key && myGameArea.key === 37) {
          player.speedX = -3;
        }
        if (myGameArea.key && myGameArea.key === 39) {
          player.speedX = 3;
        }
        if (myGameArea.key && myGameArea.key === 38) {
          player.speedY = -3;
        }
        if (myGameArea.key && myGameArea.key === 40) {
          player.speedY = 3
        }

        //add a gameframe
        myGameArea.framNo += 1;
        //spawn enemies
        if (myGameArea.framNo === 1 || everyInterval(20)) {


        }
        //update other player
      //  otherPlayer.newPos();
        otherPlayer.update();
        //update this player
        player.newPos();
        player.update();
      }
  };
    startGame();

  });
});
