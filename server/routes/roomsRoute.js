import express from 'express'
import { roomsList, joinUser, createRoom } from '../controllers/roomsController.js'

export const router = express.Router()

router.get('/list', roomsList)
router.post('/join-room', joinUser)
router.post('/create-room', createRoom)
