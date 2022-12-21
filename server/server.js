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

let userCount = 0
io.on('connection', (socket) => {
    userCount++
    console.log('User Connected::', socket.id, 'TotalUsers:', userCount)

    socket.on('newMessage', (msg) => {
        socket.broadcast.emit('newBroadcast', msg) // io.emit('newBroadcast', msg)
        console.log('server recieved message:', msg)
    })

    socket.on('disconnect', (reason) => {
        userCount--
        console.log('User:', socket.id, ' disconnected due to:', reason, ': Total connected clients:', userCount)
    })

    socket.on('connect_error', () => {
        console.log('unable to connect')
    })
})


httpServer.listen(3000, () => {
    console.log('listening on localhost:3000')
})
