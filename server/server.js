import { createServer } from "http";
import express from "express";
import { Server } from 'socket.io'
import cors from 'cors'
import { checkUserNameExists, signUp } from './db/queries.js'
import bcrypt from 'bcrypt'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:3001"]
    }
})

app.use(cors({ origin: 'http://localhost:3001' }))
app.use(express.json())

app.post('/checkUser', async (req, res) => {
    try {
        const data = await checkUserNameExists(req.body.userName)
        res.json(data)
    } catch (err) {
        res.sendStatus(500)
    }
})


app.post('/signUp', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt()
        const hashedPwd = await bcrypt.hash(req.body.password, salt)
        signUp(req.body.userName, hashedPwd)
        res.json(true)
    } catch (err) {
        res.sendStatus(500)
    }
})


httpServer.listen(3000, () => {
    console.log('listening on localhost:3000')
})
