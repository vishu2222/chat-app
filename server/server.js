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
    console.log('client connected with ID:', socket.id, 'TotalClients:', clientCount)

    socket.on('newMessage', (msg) => {
        io.emit('newBroadcast', msg)
        console.log('server recieved message:', msg)
    })

    socket.on('disconnect', () => {
        clientCount--
        console.log('client disconnected', 'TotalClients:', clientCount)
    })
})


httpServer.listen(3000, () => {
    console.log('listening on localhost:3000')
})
