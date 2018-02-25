var socket = io();
socket.on('connect', function() {
  console.log("Client connected...");
document.getElementById("btn").addEventListener("click", function() {
  var mess = document.getElementById("user_name").value;
  socket.emit('userName', mess, function(err) {
    if(err) {
      console.log(err);
    }
  });

  socket.on('incoming', function(confirmUserName) {
    console.log(confirmUserName);
  });
  socket.on('UserNameError', function(nameError) {
    document.getElementById("validName").textContent = nameError;
  });
  socket.on('newMessage', function(mess) {
    document.getElementById("matchFound").textContent = mess;
  });
  socket.on("changeRoom", function(url) {
    var currUrl = window.location.href;
    var random = Math.random() * 100;
    var newUrl = currUrl + url;
    window.location.replace(newUrl);
  });
});
});
