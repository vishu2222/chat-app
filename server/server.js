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

    socket.on('message', (msg) => {
        io.emit('msgFromServer', msg)
        console.log(msg)
    })

    socket.on('disconnect', () => {
        clientCount--
        console.log('client disconnected', 'TotalClients:', clientCount)
    })
})


httpServer.listen(3000, () => {
    console.log('listening on localhost:3000')
})
