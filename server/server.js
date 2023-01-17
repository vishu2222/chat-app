import { setupSockets } from './utilities/sockets.js'
import { authenticateToken } from './utilities/middlewere.js'
import { router as roomsRouter } from './routes/roomsRoute.js'
import { router as msgRouter } from './routes/messagesRoute.js'
import { router as userRouter } from './routes/userRoute.js'
import { createServer } from 'http'
import cookieParser from 'cookie-parser'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express() // move port to env
app.use(cors({ origin: 'http://localhost:3001', credentials: true })) //  res.header('Access-Control-Allow-Credentials', true) //  The Access-Control-Allow-Credentials response header tells browsers whether to expose the response to the frontend JavaScript code when the request's credentials mode (Request.credentials) is include.
app.use(express.json())
app.use(cookieParser())

const httpServer = createServer(app)
setupSockets(httpServer)

app.use('/rooms', authenticateToken, roomsRouter)
app.use('/msgs', authenticateToken, msgRouter)
app.use('/users', authenticateToken, userRouter)

httpServer.listen(3000, () => {
  console.log('listening on localhost:3000')
})
