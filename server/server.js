import { createServer } from 'http'
import cookieParser from 'cookie-parser'
import express from 'express'
import bcrypt from 'bcrypt'
import cors from 'cors'
import { signJwt, verifyJwt } from './controllers/jwt.js'
import { isUserNameAvailable, signUp, joinUserToRoom, createNewRoom } from './models/queries.js'
import { getUserInfo, getRoomsList, getGeneralRoomMsgs, getRoomMsgs } from './models/queries.js'
import dotenv from 'dotenv'
import { setupSockets } from './controllers/sockets.js'

const app = express()
app.use(cors({ origin: 'http://localhost:3001', credentials: true })) //  res.header('Access-Control-Allow-Credentials', true) //  The Access-Control-Allow-Credentials response header tells browsers whether to expose the response to the frontend JavaScript code when the request's credentials mode (Request.credentials) is include.
app.use(express.json())
app.use(cookieParser())

const httpServer = createServer(app)
setupSockets(httpServer)

dotenv.config()
const secretKey = process.env.SECRET_KEY

export async function authenticateToken(req, res, next) {
  const token = req.cookies.token
  if (token === undefined) return res.sendStatus(401)
  try {
    const jwtPaylod = await verifyJwt(token, secretKey)
    res.userId = jwtPaylod.user_id
    next()
  } catch (err) {
    return res.sendStatus(403)
  }
}

app.get('/rooms-list', authenticateToken, async (req, res) => {
  try {
    const roomList = await getRoomsList(res.userId)
    res.status(200).json(roomList)
  } catch (err) {
    res.sendStatus(500)
  }
})

app.get('/general-room-msgs', authenticateToken, async (req, res) => {
  try {
    const msgs = await getGeneralRoomMsgs()
    res.status(200).json(msgs)
  } catch (err) {
    res.statusCode(500)
  }
})

app.get('/msgs/:roomId', authenticateToken, async (req, res) => {
  try {
    const room_id = req.params.roomId
    const msgs = await getRoomMsgs(room_id)
    res.status(200).json(msgs)
  } catch (err) {
    res.statusCode(500)
  }
})

app.get('/check-user-name/:userName', async (req, res) => {
  try {
    const response = await isUserNameAvailable(req.params.userName)
    if (response === true) {
      return res.status(400).json({ err: 'user name already taken', status: 400 })
    }
    return res.status(200).json('user name available')
  } catch (err) {
    res.sendStatus(500)
  }
})

app.get('/authenticateUser', authenticateToken, (req, res) => {
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
    const response = await getUserInfo(req.body.userName)
    if (response === 404) return res.status(404).json({ err: 'user doesnt exists', status: 404 })

    const { user_id, user_name: userName, password: dbPassword } = response

    if (await bcrypt.compare(req.body.password, dbPassword)) {
      const claim = { user_id }
      const token = await signJwt(claim, secretKey)
      return res.cookie('token', token, { httpOnly: true }).sendStatus(200)
    }

    return res.status(401).json({ err: 'invalid password', status: 401 })
  } catch (err) {
    res.sendStatus(500)
  }
})

app.post('/joinUser', authenticateToken, async (req, res) => {
  const response = await joinUserToRoom(req.body.room, res.userId)
  console.log('response', response)
})

app.post('/create-room', authenticateToken, async (req, res) => {
  const response = await createNewRoom(req.body.room, res.userId)
  if (response === 403) return res.status(403).json('room name already exists')
  if (response === 500) return res.status(500).json('internal error')
  return res.status(200).json('new room created')
})

httpServer.listen(3000, () => {
  console.log('listening on localhost:3000')
})

// app.get('/getChatByRoom', authenticateToken, async (req, res) => {
//   try {
//     const chatByRoom = await getChatByRoom(res.userName) // userId
//     if (chatByRoom === 404) {
//       res.status(404).json({ err: 'user doesnt exists', status: 404 })
//     }
//     res.status(200).json(chatByRoom)
//   } catch (err) {
//     res.sendStatus(500)
//   }
// })
