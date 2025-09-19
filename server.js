const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5175", // React dev server
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (username) => {
    socket.username = username;
    io.emit("user-joined", username); // broadcast new user
  });

  socket.on("send-message", (message) => {
    io.emit("receive-message", {
      user: socket.username,
      text: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
  });

  socket.on("disconnect", () => {
    io.emit("user-left", socket.username);
  });
});

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
