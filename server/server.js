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

let clientCount = 0
io.on('connection', (socket) => {
    clientCount++
    console.log('User Connected::', socket.id, 'TotalUsers:', clientCount)

    socket.on('newMessage', (msg) => {
        socket.broadcast.emit('newBroadcast', msg) // io.emit('newBroadcast', msg)
        console.log('server recieved message:', msg)
    })

    socket.on('disconnect', (reason) => {
        clientCount--
        console.log('User:', socket.id, ' disconnected due to:', reason, ': Total connected clients:', clientCount)
    })

    socket.on('connect_error', () => {
        console.log('unable to connect')
    })
})


httpServer.listen(3000, () => {
    console.log('listening on localhost:3000')
})
