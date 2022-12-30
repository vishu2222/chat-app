import { AppContext } from './Chat'
import { useEffect, useState, useContext } from 'react'

export function Rooms() {
  const { messages, setFocusedRoom } = useContext(AppContext)
  const [rooms, setRooms] = useState([])
  //   const [focusedRoom, setFocusedRoom] = useState('')

  // methods
  useEffect(() => {
    const fetchedRooms = Object.keys(messages)
    setRooms(() => [...fetchedRooms])
  }, [messages])

  const roomElements = rooms.map((room, index) => (
    <div className="roomItem" key={index} onClick={() => focusRoom(room)}>
      <h5>{room}</h5>
    </div>
  ))

  function focusRoom(room) {
    setFocusedRoom(() => room)
  }

  // component return
  return (
    <div id="rooms">
      <p>Rooms</p>
      <ul>{roomElements}</ul>
    </div>
  )
}

// TODO set key to room_id

// useEffect(() => {
//     console.log('rooms:', rooms)
//   })
