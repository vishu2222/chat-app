import { createServer } from 'http'
import { Server } from 'socket.io'
import cookieParser from 'cookie-parser'
import express from 'express'
import bcrypt from 'bcrypt'
import cors from 'cors'
import { checkUserNameExists, signUp, getPassword } from './db/queries.js'
import { signJwt } from './jwt.js'

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

app.post('/checkUser', async (req, res) => {
  try {
    const userNameExists = await checkUserNameExists(req.body.userName)
    res.json(userNameExists)
  } catch (err) {
    res.sendStatus(500)
  }
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

app.post('/authenticate', async (req, res) => {
  console.log(req.headers['authorization'])
  const userName = req.body.userName
  const token = req.cookies.token // if not undefined
  //   console.log('userName: ', userName, 'token: ', token)
  if (token === undefined) res.json(false)
})
// 403 forbidden

app.get('/getToken', async (req, res) => {
  const token = await signJwt({ user: req.body.userName }, 'tempSecretKey')
  //   res.cookie('token', token, { httpOnly: true }).sendStatus(200)
  //   res.clearCookie('token', token, { httpOnly: true })
  res.sendStatus(200)
})

app.post('/login', async (req, res) => {
  try {
    const dbPassword = await getPassword(req.body.userName)
    if (await bcrypt.compare(req.body.password, dbPassword)) {
      const token = await signJwt(
        { user: req.body.userName },
        'tempSecretKey',
        { expiresIn: '15s' }
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
