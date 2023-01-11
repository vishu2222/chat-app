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
      socket.roomId = 1
      next()
    } catch (err) {
      return next(new Error('unauthorised'))
    }
  })

  let userCount = 0
  io.on('connection', (socket) => {
    userCount++
    console.log('User id:', socket.userId, ' Connected:', 'TotalUsers:', userCount)

    socket.on('newMessage', async (msg) => {
      const newMsg = {
        msg_txt: msg.msg_txt,
        msg_time: Date.now(),
        user_name: socket.userName,
        user_id: socket.userId,
        room_id: socket.roomId
      }

      const response = await addMsg(newMsg)

      if (response === 500) return socket.emit('dberror', 'failed to send message')
      socket.to(socket.roomId).emit('broadcastMsg', newMsg)
    })

    socket.on('join', async (room) => {
      socket.join(room.roomId)
      const oldRoomId = socket.roomId
      socket.roomId = room.roomId

      const LeaveMsg = {
        msg_txt: 'left',
        msg_time: Date.now(),
        user_name: socket.userName,
        user_id: socket.userId,
        room_id: oldRoomId
      }
      // await addMsg(newMsg)
      socket.to(oldRoomId).emit('userLeft', LeaveMsg)

      const joinMsg = {
        msg_txt: 'joined',
        msg_time: Date.now(),
        user_name: socket.userName,
        user_id: socket.userId,
        room_id: socket.roomId
      }
      // await addMsg(newMsg)
      socket.to(socket.roomId).emit('userJoined', joinMsg)
    })

    socket.on('disconnect', () => {
      userCount--
      console.log('User disconnected. Total connected users:', userCount)
    })
    //
  })
}
