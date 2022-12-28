import { createServer } from 'http'
import { Server } from 'socket.io'
import cookieParser from 'cookie-parser'
import express from 'express'
import bcrypt from 'bcrypt'
import cors from 'cors'
import { checkUserNameExists, signUp, getPassword } from './db/queries.js'
import { signJwt, verifyJwt } from './jwt.js'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3001']
  }
})

app.use(cors({ origin: 'http://localhost:3001', credentials: true }))
app.use(express.json())
app.use(cookieParser())
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
  console.log('in signup')
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
    const dbPassword = await getPassword(req.body.userName)
    if (await bcrypt.compare(req.body.password, dbPassword)) {
      const token = await signJwt(
        {
          user: req.body.userName
        },
        'tempSecretKey',
        { expiresIn: '30m' }
      )
      res.cookie('token', token, { httpOnly: true }).sendStatus(200)
    } else {
      res.sendStatus(401)
    }
  } catch (err) {
    res.sendStatus(500)
  }
})

httpServer.listen(3000, () => {
  console.log('listening on localhost:3000')
})
