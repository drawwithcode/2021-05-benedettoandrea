let express = require("express");
let app = express();
let port = process.env.PORT || 3000;
let server = app.listen(port);
app.use(express.static("public"));

let serverSocket = require("socket.io");
let io = serverSocket(server);

io.on("connection", (socket) => {
  socket.on("patternRot", (data) => {
    socket.broadcast.emit("mouseBroadcast", socket.id, data);
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("peerDisconnect", socket.id);
  });
});
