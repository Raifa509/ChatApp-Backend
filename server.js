const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174", // React dev server URL
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (username) => {
    socket.username = username;
    io.emit("user-joined", username);
  });

  socket.on("send-message", (message) => {
    io.emit("receive-message", { user: socket.username, text: message });
  });

  socket.on("disconnect", () => {
    io.emit("user-left", socket.username);
  });
});

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
