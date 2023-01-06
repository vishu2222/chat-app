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
    console.log(messages)
    const fetchedRooms = []
    fetchedRoomIds.forEach((roomId) =>
      fetchedRooms.push({
        roomId: roomId,
        roomName: messages[roomId][0].room_name // will break if room the room has 0 messages
      })
    )
    setUserRooms(() => [...fetchedRooms])
  }, [messages])

  function focusRoom(roomId) {
    if (focusedRoomId !== roomId) {
      socket.emit('joinRoom', { userName, roomId })
      setFocusedRoomId(() => roomId)
    }
  }

  const roomElements = userRooms.map((room, index) => (
    <div className='roomItem' key={index} onClick={() => focusRoom(room.roomId)}>
      <p>
        {room.roomId}: {room.roomName}
      </p>
    </div>
  ))

  // component return
  return (
    <div id='rooms'>
      <h4 id='room-title'>Rooms</h4>
      <div className='room-elements'>{roomElements}</div>
    </div>
  )
}
