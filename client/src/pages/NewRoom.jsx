import { useState, useContext } from 'react'
import '../styles/NewRoom.css'
import { joinUser } from '../requests'
import { createNewRoom } from '../requests'
import { AppContext } from './ChatRooms'
import { getRooms } from '../requests'

export function NewRoom() {
  const { setRoomsList } = useContext(AppContext)
  const [room, setRoom] = useState('')
  const [newRoom, setNewRoom] = useState('')
  const [displayErr, setDisplayErr] = useState(false)
  const [errMsg, setErrMsg] = useState('')

  async function joinRoom() {
    const res = await joinUser(room)
    console.log('res:', res)
    if (res === 404) {
      setErrMsg('* room doesnt exists')
      setDisplayErr(true)
    }
    if (res === 403) {
      setErrMsg('* you already are a member of the room')
      setDisplayErr(true)
    }

    setRoom('')
    const rooms = await getRooms()
    setRoomsList(() => rooms)
  }

  async function createRoom() {
    const res = await createNewRoom(newRoom)
    if (res === 403) {
      setErrMsg('* room name already exists')
      setDisplayErr(true)
    }
    if (res === 500) {
      setErrMsg('* server error')
      setDisplayErr(true)
    }
    setNewRoom('')
    const rooms = await getRooms()
    setRoomsList(() => rooms)
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
