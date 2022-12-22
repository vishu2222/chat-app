import './App.css';
import { io } from 'socket.io-client'
import { useState } from 'react';
import { ChatBox } from './components/ChatBox';
import { JoinRoom } from './components/JoinRoom';
// import { DisplayMsg } from "./components/DisplayMsg";

const socket = io.connect('http://localhost:3000') // const socket = io('http://localhost:3000')

function App() {

  const [userJoined, setUserJoined] = useState(false)

  socket.on('connect', () => {
    console.log('connected with id', socket.id)
  })

  function sendNewMessage(newChatTxt) {
    socket.emit('newMessage', newChatTxt)
  }

  socket.on('newBroadcast', (msg) => {
    console.log('BroadCast from server:', msg)
  })

  function joinUser(userName, room) {
    console.log(userName, room)
    socket.emit('joinRoom', { userName: userName, room: room })
    setUserJoined(true)
  }

  return (
    <div className="App" id='app-container'>
      {!userJoined && <JoinRoom joinUser={joinUser} />}
      {userJoined && <ChatBox sendNewMessage={sendNewMessage} />}
    </div>
  );
}

export default App;



// <h2>Join A chat</h2>
//       <input type="text" placeholder='User Name' onChange={(e) => setUserName(e.target.value)} />
//       <input type="text" placeholder='Room' onChange={(e) => setRoom(e.target.value)} />
//       <button>Join</button>