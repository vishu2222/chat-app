import { getRoomsList, joinUserToRoom, createNewRoom } from '../models/queries.js'

export async function roomsList(req, res) {
  try {
    const roomsList = await getRoomsList(res.userId)
    res.status(200).json(roomsList)
  } catch (err) {
    res.status(500).json({ response: 'internal server error' })
  }
}

export async function joinUser(req, res) {
  try {
    const response = await joinUserToRoom(req.body.room, res.userId)
    if (response === 404) return res.status(404).json({ response: 'room doesnt exist' })
    if (response === 409)
      return res.status(409).json({ response: 'you already are member of the room' })
    return res.status(200).json('user added to the room')
  } catch (err) {
    return res.status(500).json({ response: 'internal server error' })
  }
}

export async function createRoom(req, res) {
  try {
    const response = await createNewRoom(req.body.room, res.userId)
    if (response === 403) return res.status(403).json({ response: 'room name already exists' })
    if (response === 500) return res.status(500).json({ response: 'internal error' })
    return res.status(200).json({ response: 'new room created' })
  } catch (err) {
    return res.status(500).json({ response: 'internal server error' })
  }
}
