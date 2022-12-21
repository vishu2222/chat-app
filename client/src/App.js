import './App.css';
import { io } from 'socket.io-client'
import { useState } from 'react'

function App() {
  const [chatTxt, setChatTxt] = useState('')
  const socket = io('http://localhost:3000')

  socket.on('connect', () => {
    console.log('connected with id', socket.id)
  })

  socket.on('msgFromServer', (msg) => {
    console.log('recived from server:', msg)
  })

  function sendMessage() {
    socket.emit('message', chatTxt)
    setChatTxt('')
  }

  return (
    <div className="App" id='app-container'>
      <div id='message-container'></div>
      <div id='form-div'>
        <form id='from' onSubmit={(e) => e.preventDefault()}>
          <input id='input'
            placeholder='...type here'
            value={chatTxt}
            onChange={(e) => setChatTxt(e.target.value)}>
          </input>
          <button onClick={sendMessage}>send</button>
        </form>
      </div>
    </div>
  );
}

export default App;
