import { createServer } from 'http'
import { Server } from 'socket.io'
import cookieParser from 'cookie-parser'
import express from 'express'
import bcrypt from 'bcrypt'
import cors from 'cors'
import { signJwt, verifyJwt } from './jwt.js'
import { checkUserNameExists, signUp, addMsg } from './models/queries.js'
import { getPassword, getChatByRoom } from './models/queries.js'
import * as dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors({ origin: 'http://localhost:3001', credentials: true })) //  res.header('Access-Control-Allow-Credentials', true) //  The Access-Control-Allow-Credentials response header tells browsers whether to expose the response to the frontend JavaScript code when the request's credentials mode (Request.credentials) is include.
app.use(express.json())
app.use(cookieParser())

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3001']
  },
  cookie: true,
  httpOnly: true
})

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.headers.cookie.split('=')[1] // if (token === undefined) return next(new Error('unauthorised'))
    const jwtPaylod = await verifyJwt(token, secretKey)
    socket.userName = jwtPaylod.user
    next()
  } catch (err) {
    return next(new Error('unauthorised'))
  }
})

let userCount = 0
io.on('connection', (socket) => {
  userCount++
  console.log('User', socket.userName, ' Connected:', socket.id, 'TotalUsers:', userCount)

  socket.on('joinRoom', (data) => {
    socket.join(data.roomId)
    socket.to(data.roomId).emit('newBroadcast', {
      msg_txt: ` joined`,
      msg_time: new Date(Date.now()).toISOString(),
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
})

const secretKey = process.env.SECRET_KEY

export async function authenticateToken(req, res, next) {
  const token = req.cookies.token
  if (token === undefined) return res.sendStatus(401)
  try {
    const jwtPaylod = await verifyJwt(token, secretKey)
    res.userName = jwtPaylod.user
    next()
  } catch (err) {
    return res.sendStatus(403)
  }
}

app.post('/checkUser', async (req, res) => {
  try {
    const status = await checkUserNameExists(req.body.userName)
    if (status === true) return res.status(400).json({ err: 'user already exists', status: 400 })
    return res.status(200).json('success')
  } catch (err) {
    res.sendStatus(500)
  }
})

app.get('/authenticateUser', authenticateToken, (req, res) => {
  console.log('in authUser')
  return res.sendStatus(200)
})

app.post('/signUp', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt()
    const hashedPwd = await bcrypt.hash(req.body.password, salt)
    await signUp(req.body.userName, hashedPwd)
    res.sendStatus(200) // 201
  } catch (err) {
    res.sendStatus(500)
  }
})

app.post('/login', async (req, res) => {
  try {
    const userName = req.body.userName
    const validUserName = await checkUserNameExists(userName)
    if (validUserName === false) return res.status(404).json({ err: 'user doesnt exists', status: 404 })
    const dbPassword = await getPassword(userName) // remove extra query
    if (await bcrypt.compare(req.body.password, dbPassword)) {
      const claim = { user: userName }
      const token = await signJwt(claim, secretKey)
      res.cookie('token', token, { httpOnly: true }).sendStatus(200)
    } else {
      res.status(401).json({ err: 'invalid password', status: 401 })
    }
  } catch (err) {
    res.sendStatus(500)
  }
})

app.get('/getChatByRoom', authenticateToken, async (req, res) => {
  try {
    const chatByRoom = await getChatByRoom(res.userName)
    if (chatByRoom === 404) {
      res.status(404).json({ err: 'user doesnt exists', status: 404 })
    }
    res.status(200).json(chatByRoom)
  } catch (err) {
    res.sendStatus(500)
  }
})

httpServer.listen(3000, () => {
  console.log('listening on localhost:3000')
})
