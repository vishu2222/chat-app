import { AppContext } from './ChatRooms'
import { useContext } from 'react'

export function DisplayRooms() {
  const { roomsList } = useContext(AppContext)

  function focusRoom(roomId) {
    console.log(roomId)
  }

  const roomElements = roomsList.map((room) => (
    <div className='roomItem' key={room.room_id} onClick={() => focusRoom(room.room_id)}>
      <p>{room.room_name}</p>
    </div>
  ))

  return (
    <div id='rooms-container'>
      <div id='rooms-title'>
        <p>Rooms</p>
      </div>
      <div id='room-items'>{roomElements}</div>
    </div>
  )
}
