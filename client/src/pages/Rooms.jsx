import { AppContext } from './Chat'
import { useEffect, useState, useContext } from 'react'

export function Rooms() {
  const { messages, setFocusedRoom, socket, userName } = useContext(AppContext)
  const [rooms, setRooms] = useState([])

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
    setRooms(() => [...fetchedRooms])
  }, [messages])

  const roomElements = rooms.map((room, index) => (
    <div
      className="roomItem"
      key={index}
      onClick={() => focusRoom(room.roomId)}>
      <h4>
        {room.roomId} {room.roomName}
      </h4>
    </div>
  ))

  function focusRoom(room) {
    setFocusedRoom(() => room)
    socket.emit('joinRoom', { userName, room })
  }

  // component return
  return (
    <div id="rooms">
      <h4>Rooms</h4>
      <ul>{roomElements}</ul>
    </div>
  )
}

// TODO set key to room_id

// useEffect(() => {
//     console.log('rooms:', rooms)
//   })
