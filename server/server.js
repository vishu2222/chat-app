import { createServer } from 'http'
import { Server } from 'socket.io'
import cookieParser from 'cookie-parser'
import express from 'express'
import bcrypt from 'bcrypt'
import cors from 'cors'
import { signJwt, verifyJwt } from './jwt.js'
import { checkUserNameExists, signUp } from './db/queries.js'
import { getPassword, getUsersChatByRoom } from './db/queries.js'

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
    // if error 403
    res.userName = jwtPaylod.user
    next()
  } catch (err) {
    return res.sendStatus(500) //
  }
}

app.post('/checkUser', async (req, res) => {
  try {
    const status = await checkUserNameExists(req.body.userName)
    if (status === true)
      return res.status(400).json({ err: 'user already exists', status: 400 })
    return res.status(200).json('success')
  } catch (err) {
    res.sendStatus(500) // 400 for resourse not found
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
    res.sendStatus(200) // 201
  } catch (err) {
    res.sendStatus(500)
  }
})

app.post('/login', async (req, res) => {
  try {
    const userName = req.body.userName
    const validUserName = await checkUserNameExists(userName)
    if (validUserName === false)
      return res.status(404).json({ err: 'user doesnt exists', status: 404 })
    const dbPassword = await getPassword(userName)
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

app.post('/getUsersChatByRoom', authenticateToken, async (req, res) => {
  //
  try {
    const userChatByRoom = await getUsersChatByRoom(req.body.userName)
    if (userChatByRoom === 404) {
      res.status(404).json({ err: 'user doesnt exists', status: 404 })
    }
    res.status(200).json(userChatByRoom)
  } catch (err) {
    res.sendStatus(500)
  }
})

httpServer.listen(3000, () => {
  console.log('listening on localhost:3000')
})
