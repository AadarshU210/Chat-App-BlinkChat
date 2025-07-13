import {Server} from 'socket.io'
import http from 'http'
import express from 'express'

const app = express()
const server = http.createServer(app)

const io = new Server( server, {
    cors:{
        origin:[`${process.env.CLIENT_URL}`]
    }
});

export function getReceiverSocketId(userId){
   return userSocketMap[userId]
}

const userSocketMap = {};

//listening for connection
io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
 
    const userId = socket.handshake.query.userId
    if(userId) userSocketMap[userId] = socket.id
    
    /* io.emit() is used to send events to all the connected clients. 
    it has a named event which can be listened on to the client side*/
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
    
    //listening for disconnect
    socket.on("disconnect", () => {
       console.log("A user disconnected", socket.id)
       delete userSocketMap[userId];
       io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

export {io, app, server};