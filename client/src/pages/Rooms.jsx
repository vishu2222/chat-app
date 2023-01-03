import { AppContext } from './Chat'
import { useEffect, useState, useContext } from 'react'

export function Rooms() {
  // context
  const { messages, setFocusedRoomId, socket, userName, focusedRoomId } = useContext(AppContext)

  // state
  const [userRooms, setUserRooms] = useState([])

  // methods
  useEffect(() => {
    const fetchedRoomIds = Object.keys(messages)
    const fetchedRooms = []
    fetchedRoomIds.forEach((roomId) =>
      fetchedRooms.push({
        roomId: roomId,
        roomName: messages[roomId][0].room_name
      })
    )
    setUserRooms(() => [...fetchedRooms])
  }, [messages])

  function focusRoom(roomId) {
    socket.emit('joinRoom', { userName, roomId })
    setFocusedRoomId(() => roomId)
  }

  const roomElements = userRooms.map((room, index) => (
    <div className='roomItem' key={index} onClick={() => focusRoom(room.roomId)}>
      <h4>
        {room.roomId} {room.roomName}
      </h4>
    </div>
  ))

  // component return
  return (
    <div id='rooms'>
      <h4>Rooms</h4>
      <ul>{roomElements}</ul>
    </div>
  )
}

// TODO set key to room_id
