import { createServer } from "http";
import express from "express";
import { Server } from 'socket.io'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:3001"]
    }
})

io.on('connection', (socket) => {
    console.log('client connected with ID:', socket.id)
    socket.on('message', (msg) => {
        io.emit('msgFromServer', msg)
        console.log(msg)
    })
})

httpServer.listen(3000, () => {
    console.log('listening on localhost:3000')
})
