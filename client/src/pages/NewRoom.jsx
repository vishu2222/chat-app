import { useState } from 'react'
import '../styles/NewRoom.css'
import { joinUser } from '../requests'
import { createNewRoom } from '../requests'

export function NewRoom({ socket }) {
  const [room, setRoom] = useState('')
  const [newRoom, setNewRoom] = useState('')
  const [displayErr, setDisplayErr] = useState(false)
  const [errMsg, setErrMsg] = useState('')

  function joinRoom() {
    joinUser(room)
    setRoom('')
  }

  async function createRoom() {
    const res = await createNewRoom(newRoom)
    if (res === 403) {
      setErrMsg('room name already exists')
      setDisplayErr(true)
    }
    if (res === 500) {
      setErrMsg('server error')
      setDisplayErr(true)
    }
    setNewRoom('')
  }

  return (
    <div id='join-room'>
      <label>
        <h4>Join a Room</h4>
      </label>
      <input
        type='text'
        placeholder='Room'
        value={room}
        onChange={(e) => {
          setRoom(e.target.value)
          setDisplayErr(false)
        }}
      />
      <button onClick={joinRoom}>Join</button>

      <label>
        <h4>Create New Room</h4>
      </label>
      <input
        type='text'
        placeholder='create'
        value={newRoom}
        onChange={(e) => {
          setNewRoom(e.target.value)
          setDisplayErr(false)
        }}
      />
      <button onClick={createRoom}>Create room</button>
      {displayErr && <h3 className='err-msg'>{errMsg}</h3>}
    </div>
  )
}
