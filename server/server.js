import { setupSockets } from './utilities/sockets.js'
import { authenticateToken } from './utilities/middlewere.js'
import { router as roomsRouter } from './routes/roomsRoute.js'
import { router as msgRouter } from './routes/messagesRoute.js'
import { router as userRouter } from './routes/userRoute.js'
import { routeTypeDetector } from './utilities/routeTypeDetector.js'
import { createServer } from 'http'
import cookieParser from 'cookie-parser'
import express from 'express'
import dotenv from 'dotenv'

import { dirname } from 'path'
import { fileURLToPath } from 'url'
import path from 'path'

dotenv.config()

const app = express() // move port to env
// app.use(cors({ origin: 'http://localhost:3001', credentials: true })) //  res.header('Access-Control-Allow-Credentials', true) //  The Access-Control-Allow-Credentials response header tells browsers whether to expose the response to the frontend JavaScript code when the request's credentials mode (Request.credentials) is include.
app.use(express.json())
app.use(cookieParser())

const httpServer = createServer(app)
setupSockets(httpServer)

const filePath = dirname(fileURLToPath(import.meta.url))
app.use(express.static(path.join(filePath, 'public')))
app.use(routeTypeDetector(filePath))

app.use('/api/rooms', authenticateToken, roomsRouter)
app.use('/api/msgs', authenticateToken, msgRouter)
app.use('/api/users', authenticateToken, userRouter)

httpServer.listen(process.env.PORT, () => {
  console.log('listening for requests')
})
