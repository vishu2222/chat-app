import { useState } from 'react'

export function JoinRoom({ joinUser, socket }) {
  const [userName, setUserName] = useState('')
  const [room, setRoom] = useState('')

  function joinRoom() {
    joinUser(userName, room)
    setUserName('')
    setRoom('')
  }

  return (
    <div id='join-room'>
      <label>
        <h4>Join a Room</h4>
      </label>
      <input type='text' placeholder='Room' onChange={(e) => setRoom(e.target.value)} />
      <button onClick={joinRoom}>Join</button>
    </div>
  )
}
