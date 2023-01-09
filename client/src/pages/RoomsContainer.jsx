import { AppContext } from './ChatRooms'
import { useContext, useState } from 'react'
import { getRoomMsgs } from '../requests.js'
import '../styles/RoomsContainer.css'

export function RoomsContainer() {
  const [focusedRoomId, setFocusedRoomId] = useState(1)
  const { roomsList, setMessages, socket } = useContext(AppContext)

  async function focusRoom(roomId) {
    if (focusedRoomId !== roomId) {
      const roomMsgs = await getRoomMsgs(roomId)
      setMessages(() => roomMsgs)
      setFocusedRoomId(() => roomId)
      socket.emit('join', { roomId })
    }
  }

  const roomElements = roomsList.map((room) => (
    <div className='roomItem' key={room.room_id} onClick={() => focusRoom(room.room_id)}>
      <p className='room-content'>{room.room_name}</p>
    </div>
  ))

  return (
    <div id='rooms-container'>
      <div id='rooms-title'>
        <p>Rooms</p>
      </div>
      <div className='room-items'>{roomElements}</div>
    </div>
  )
}
