import { Server } from 'socket.io'
import { verifyJwt } from './jwt.js'
import { addMsg } from '../models/queries.js'
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

  // handle different stauses
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.headers.cookie.split('=')[1] // if (token === undefined) return next(new Error('unauthorised'))
      const jwtPaylod = await verifyJwt(token, secretKey)
      socket.userName = jwtPaylod.user // change to id
      next()
    } catch (err) {
      return next(new Error('unauthorised'))
    }
  })

  let userCount = 0
  io.on('connection', (socket) => {
    userCount++
    console.log('User', socket.userName, ' Connected:', 'TotalUsers:', userCount)

    socket.on('joinRoom', (data) => {
      socket.join(data.roomId)
      socket.to(data.roomId).emit('newBroadcast', {
        msg_txt: ` joined`,
        msg_time: Date.now(),
        user_name: data.userName,
        roomId: data.roomId
      })
    })

    socket.on('newMessage', (msg) => {
      addMsg(msg)
      socket.to(msg.roomId).emit('newBroadcast', msg)
    })

    socket.on('disconnect', () => {
      userCount--
      console.log('User disconnected. Total connected users:', userCount)
    })
    //
  })
}
