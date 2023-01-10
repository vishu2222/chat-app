import { useState } from 'react'
import '../styles/NewRoom.css'
import { joinUser } from '../requests'

export function NewRoom({ socket }) {
  const [room, setRoom] = useState('')

  function joinRoom() {
    joinUser(room)
    setRoom('')
  }

  function createRoom() {}

  return (
    <div id='join-room'>
      <label>
        <h4>Join a Room</h4>
      </label>
      <input type='text' placeholder='Room' onChange={(e) => setRoom(e.target.value)} />
      <button onClick={joinRoom}>Join</button>

      <label>
        <h4>Create New Room</h4>
      </label>
      <input type='text' placeholder='create' onChange={(e) => createRoom(e.target.value)} />
    </div>
  )
}
