import { Server } from 'socket.io'
import { verifyJwt } from './jwt.js'
import { addMsg, getUserName } from '../models/queries.js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') })
const secretKey = process.env.SECRET_KEY

export function setupSockets(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: ['http://localhost:3001']
    },
    cookie: true,
    httpOnly: true
  })

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.headers.cookie.split('=')[1]
      const jwtPaylod = await verifyJwt(token, secretKey)

      socket.userId = jwtPaylod.user_id
      socket.userName = await getUserName(jwtPaylod.user_id)
      next()
    } catch (err) {
      return next(new Error('unauthorised'))
    }
  })

  let userCount = 0
  io.on('connection', (socket) => {
    userCount++
    console.log('User Connected, TotalUsers:', userCount)

    // socket.join(1)
    // new-message
    socket.on('new-message', async (msg) => {
      const newMsg = {
        msg_txt: msg.msg_txt,
        msg_time: Date.now(),
        user_name: socket.userName,
        user_id: socket.userId,
        room_id: socket.roomId || 1
      }

      const response = await addMsg(newMsg)
      if (response === 500) return socket.emit('error', 'failed to send message')
      socket.to(socket.roomId).emit('broadcastMsg', newMsg)
    })

    // leave-room
    socket.on('leave-room', async (roomId) => {
      const leaveMsg = {
        msg_txt: 'left',
        msg_time: Date.now(),
        user_name: socket.userName,
        user_id: socket.userId,
        room_id: roomId,
        roomMsg: true
      }
      socket.to(roomId).emit('user-left', leaveMsg)
      socket.leave(roomId)
    })

    // join-room
    socket.on('join-room', async (roomId) => {
      socket.join(roomId)
      socket.roomId = roomId

      const joinMsg = {
        msg_txt: 'joined',
        msg_time: Date.now(),
        user_name: socket.userName,
        user_id: socket.userId,
        room_id: roomId,
        roomMsg: true
      }
      socket.to(roomId).emit('user-joined', joinMsg)
    })

    // disconnect
    socket.on('disconnect', () => {
      const disconnectMsg = {
        msg_txt: 'disconnected',
        msg_time: Date.now(),
        user_name: socket.userName,
        user_id: socket.userId,
        room_id: socket.roomId,
        roomMsg: true
      }
      socket.to(socket.roomId).emit('user-left', disconnectMsg)

      userCount--
      console.log('User disconnected, Total users:', userCount)
    })
    //
  })
}
