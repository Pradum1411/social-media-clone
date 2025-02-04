const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const usermodel = require("../model/user.model");
const messagemodel = require("../model/message.model")



var io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (change in production)
    methods: ["GET", "POST"]
  }
});
const chatNamespace = io.of("/chat");


chatNamespace.on("connection", async (socket) => {
  const userId = socket.handshake.auth.userId;
  if (userId) {

    await usermodel.findByIdAndUpdate({ _id: userId }, { isOnline: true })
    await socket.broadcast.emit("getOnlineUser", { userId })
    console.log(`user connected: userId --${userId} socketId:--${socket.id}`)

  }
  socket.on("disconnect", async () => {
    if (userId) {
      await usermodel.findByIdAndUpdate({ _id: userId }, { isOnline: false })
      await socket.broadcast.emit("getOfflineUser", { userId })
      console.log(`user disconnected: userId --${userId} socketId:--${socket.id}`)


    }
  })

  socket.on("newChat", (data) => {
    socket.broadcast.emit("loadnewChat", data)
  })
  socket.on("updatechat", () => {
    console.log("hiii")
    socket.broadcast.emit("updatechathistry")
  })
  socket.on("deletedchat", (data) => {
    socket.broadcast.emit("updatedeletedchat", data)
  })

  socket.on("likedpost", (data) => {
    socket.broadcast.emit("likedpostupdate", data);
    console.log("Post liked:", data);

  });

  socket.on("updatecomment",(data)=>{
    socket.broadcast.emit("newupdatecomment",data)
  })

  socket.on("removestory",(data)=>{
    socket.broadcast.emit("removestory1",data)
  })
})

// Listen on port 3

module.exports = { app, server, io }
