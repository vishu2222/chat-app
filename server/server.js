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

let usersCount = 0
io.on('connection', (socket) => {
    usersCount++
    console.log('socket connected with id', socket.id, 'userCount:', usersCount)

    socket.on('disconnect', () => {
        usersCount--
        console.log('socket disconnected with id', socket.id, 'userCount:', usersCount)
    })

    socket.on('joinRoom', (data) => { // check if the userName already exists first
        socket.join(data.room) // socket.userName = data.userName
        socket.emit('userJoined', data)
        console.log('user:', data.userName, 'joined room:', data.room)
    })

    socket.on('newMessage', (data) => {
        console.log('server recieved newMessage:', data)
        socket.broadcast.to(data.room).emit('broadcastMsg', data)
    })

})

httpServer.listen(3000, () => {
    console.log('listening on localhost:3000')
})
