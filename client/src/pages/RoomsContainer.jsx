import { AppContext } from './ChatRooms'
import { useContext, useEffect, useState } from 'react'
import { getRoomMsgs } from '../requests.js'
import '../styles/RoomsContainer.css'

export function RoomsContainer() {
  const [focusedRoomId, setFocusedRoomId] = useState(1)

  const { roomsList, setMessages, socket, setFocusedRoomName } = useContext(AppContext)

  useEffect(() => {
    socket.on('user-joined', (msg) => {
      if (msg.room_id === focusedRoomId) {
        setMessages((current) => [...current, msg])
      }
    })

    socket.on('user-left', (msg) => {
      if (msg.room_id === focusedRoomId) {
        setMessages((current) => [...current, msg])
      }
    })
    return () => {
      socket.off('user-joined')
      socket.off('user-left')
    }
  }, [socket, focusedRoomId, setMessages])

  async function focusRoom(roomId, roomName) {
    if (focusedRoomId !== roomId) {
      socket.emit('leave-room', focusedRoomId)
      socket.emit('join-room', roomId)

      const roomMsgs = await getRoomMsgs(roomId)

      setMessages(() => roomMsgs)
      setFocusedRoomId(() => roomId)
      setFocusedRoomName(() => roomName)
    }
  }

  const roomElements = roomsList.map((room) => (
    <div className='roomItem' key={room.room_id} onClick={() => focusRoom(room.room_id, room.room_name)}>
      <p className='room-content'>{room.room_name}</p>
    </div>
  ))

  return (
    <div id='rooms-container'>
      <div id='rooms-title-div'>
        <p id='rooms-title'>
          <strong>Rooms</strong>
        </p>
      </div>
      <div className='room-items'>{roomElements}</div>
    </div>
  )
}
