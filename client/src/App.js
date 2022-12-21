import './App.css';
import { io } from 'socket.io-client'
// import { useState } from 'react';
import { ChatBox } from './components/ChatBox';
import { DisplayMsg } from "./components/DisplayMsg";

const socket = io.connect('http://localhost:3000') // const socket = io('http://localhost:3000')

function App() {

  // const [userName, setUserName] = useState('')
  // const [room, setRoom] = useState('')

  socket.on('connect', () => {
    console.log('connected with id', socket.id)
  })

  function sendMessage(newChatTxt) {
    socket.emit('newMessage', newChatTxt)
  }

  socket.on('newBroadcast', (msg) => {
    console.log('BroadCast from server:', msg)
  })

  return (
    <div className="App" id='app-container'>
      <ChatBox msg={sendMessage} />
      <DisplayMsg msg={newMsg} />
    </div>
  );
}

export default App;



// <h2>Join A chat</h2>
//       <input type="text" placeholder='User Name' onChange={(e) => setUserName(e.target.value)} />
//       <input type="text" placeholder='Room' onChange={(e) => setRoom(e.target.value)} />
//       <button>Join</button>