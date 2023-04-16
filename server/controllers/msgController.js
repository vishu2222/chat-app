import { getGeneralRoomMsgs, getRoomMsgs } from '../models/queries.js'

export async function defaultRoomMsgs(req, res) {
  try {
    const msgs = await getGeneralRoomMsgs()
    res.status(200).json(msgs)
  } catch (err) {
    res.sendStatus(500)
  }
}

export async function getRoomMessages(req, res) {
  try {
    const room_id = req.params.roomId
    // console.log(room_id, res.userId)
    const msgs = await getRoomMsgs(room_id, res.userId)
    // console.log('roomMsgs', msgs)
    res.status(200).json(msgs)
  } catch (err) {
    res.sendStatus(500)
  }
}
