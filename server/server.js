import { createServer } from 'http'
import express from 'express'
import { Server } from 'socket.io'
import cors from 'cors'
import { checkUserNameExists, signUp, getPassword } from './db/queries.js'
import bcrypt from 'bcrypt'
import { signJwt } from './jwt.js'
import cookieParser from 'cookie-parser'

const app = express()
// const httpServer = createServer(app)
// const io = new Server(httpServer, {
//   cors: {
//     origin: ['http://localhost:3001']
//   }
// })

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
  try {
    const salt = await bcrypt.genSalt()
    const hashedPwd = await bcrypt.hash(req.body.password, salt)
    await signUp(req.body.userName, hashedPwd)
    res.sendStatus(200)
  } catch (err) {
    res.sendStatus(500)
  }
})

app.get('/getToken', async (req, res) => {
  console.log(req.cookies)
  const token = await signJwt({ user: req.body.userName }, 'tempSecretKey')
  res.cookie('token', token, { httpOnly: true }).sendStatus(200)
  //   res.clearCookie('token', token, { httpOnly: true })
})

app.post('/login', async (req, res) => {
  try {
    const savedPwd = await getPassword(req.body.userName)
    if (await bcrypt.compare(req.body.password, savedPwd)) {
      //   const token = await signJwt({ user: req.body.userName }, 'tempSecretKey')
      //   res.cookie('token', token) //.json({ token })
      res.sendStatus(200)
    } else {
      res.sendStatus(401)
    }
  } catch (err) {
    res.sendStatus(500)
  }
})

// httpServer.listen(3000, () => {
//   console.log('listening on localhost:3000')
// })

app.listen(3000, () => {
  console.log('listening on localhost:3000')
})
