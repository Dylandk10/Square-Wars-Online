//Make sure players dont have same usernames...

var hold = [];

var playerCheck = (player) => {
  var result;
  for(var i = 0; i <= hold.length; i++) {
    if(player === hold[i]) {
      return false;
    } else {
      hold.push(player);
      return true;
    }
  }
};

//function to control hold holdMemory
var holdMemory = (username) => {
  hold = hold.slice(username, 0);
  console.log("HoldMemory: ", hold);
};

module.exports = {
  playerCheck,
  holdMemory
}
