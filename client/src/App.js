import './App.css';
import { io } from 'socket.io-client';
import { useState } from 'react';
import { Home } from './components/Home';
import { MsgBox } from './components/MsgBox';

const socket = io.connect('http://localhost:3000')

function App() {
  socket.on('connect', () => { console.log('connected with id:', socket.id) })

  // state
  const [userJoined, setUserJoined] = useState(false)
  const [userName, setUserName] = useState('')
  const [room, setRoom] = useState('')

  // methods
  function assignUser(userName, room) {
    setUserName(userName)
    setRoom(room)
  }

  //  component return
  return (
    <div>
      {!userJoined && <Home socket={socket} setUserJoined={setUserJoined} assignUser={assignUser} />}
      {userJoined && <MsgBox socket={socket} userName={userName} room={room} />}
    </div>)
}

export default App;
