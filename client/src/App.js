import './App.css'
import { io } from 'socket.io-client'
import { useState, useEffect } from 'react'
import { Home } from './components/Home'
import { MsgBox } from './components/MsgBox'

const socket = io.connect('http://localhost:3000')

function App() {

  // state
  const [userJoinStatus, setUserStatus] = useState(false)
  const [userName, setUserName] = useState('')
  const [room, setRoom] = useState('')

  // methods
  function assignUser(userName, room) {
    setUserName(userName)
    setRoom(room)
  }

  useEffect(() => {
    socket.on('connect', () => {
      console.log('new user connected with id:', socket.id)
    })
  }, [])

  //  component return
  return (

    <div id='appContainer'>
      {!userJoinStatus && <Home socket={socket} setUserStatus={setUserStatus} assignUser={assignUser} />}
      {userJoinStatus && <MsgBox socket={socket} userName={userName} room={room} />}
    </div>)
}

export default App;
