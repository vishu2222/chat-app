import express from 'express'
import { defaultRoomMsgs, getRoomMessages } from '../controllers/msgController.js'

export const router = express.Router()

router.get('/default-room', defaultRoomMsgs)
router.get('/:roomId', getRoomMessages)
