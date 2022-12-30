import { createServer } from 'http'
import { Server } from 'socket.io'
import cookieParser from 'cookie-parser'
import express from 'express'
import bcrypt from 'bcrypt'
import cors from 'cors'
import { signJwt, verifyJwt } from './jwt.js'
import { checkUserNameExists, signUp } from './db/queries.js'
import { getPassword, getUserChatByRooms } from './db/queries.js'

const app = express()
app.use(cors({ origin: 'http://localhost:3001', credentials: true })) //  res.header('Access-Control-Allow-Credentials', true) //  The Access-Control-Allow-Credentials response header tells browsers whether to expose the response to the frontend JavaScript code when the request's credentials mode (Request.credentials) is include.

app.use(express.json())
app.use(cookieParser())
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3001']
  }
})

const secretKey = 'tempSecretKey'

export async function authenticateToken(req, res, next) {
  try {
    const token = req.cookies.token
    if (token === undefined) return res.sendStatus(401)
    const jwtPaylod = await verifyJwt(token, secretKey)
    res.userName = jwtPaylod.user
  } catch (err) {
    return res.sendStatus(401)
  }
  next()
}

app.post('/checkUser', async (req, res) => {
  try {
    const userNameExists = await checkUserNameExists(req.body.userName)
    res.json(userNameExists)
  } catch (err) {
    res.sendStatus(500)
  }
})

app.get('/authenticateUser', authenticateToken, (req, res) => {
  const userName = res.userName
  return res.json(userName)
})

app.post('/signUp', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt()
    const hashedPwd = await bcrypt.hash(req.body.password, salt)
    await signUp(req.body.userName, hashedPwd)
    res.sendStatus(200)
  } catch (err) {
    res.sendStatus(500)
  }
})

app.post('/login', async (req, res) => {
  try {
    const userName = req.body.userName
    const dbPassword = await getPassword(userName)
    if (await bcrypt.compare(req.body.password, dbPassword)) {
      const claim = { user: userName }
      const token = await signJwt(claim, secretKey)
      res.cookie('token', token, { httpOnly: true }).sendStatus(200)
    } else {
      res.sendStatus(401)
    }
  } catch (err) {
    res.sendStatus(500)
  }
})

app.post('/getUserChatByRooms', authenticateToken, async (req, res) => {
  try {
    const userChatByRoom = await getUserChatByRooms(req.body.userName)
    res.json(userChatByRoom)
  } catch (err) {
    res.sendStatus(500)
  }
})

httpServer.listen(3000, () => {
  console.log('listening on localhost:3000')
})
