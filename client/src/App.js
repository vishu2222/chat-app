import './App.css';
import { io } from 'socket.io-client'
import { useState } from 'react'
import { Message } from './components/Message.jsx';

function App() {
  const [chatTxt, setChatTxt] = useState('')
  const [messages, setMessages] = useState([])
  const socket = io('http://localhost:3000')

  socket.on('connect', () => {
    console.log('connected with id', socket.id)
  })

  socket.on('msgFromServer', (msg) => {
    console.log('recived from server:', msg)
    const id = Math.max(messages.map(msg => msg.id)) + 1 || 0
    setMessages([...messages, { id: id, msg: msg }])
  })

  function sendMessage() {
    socket.emit('message', chatTxt)
    setChatTxt('')
  }

  return (
    <div className="App" id='app-container'>
      <div id='message-container'>
        {messages.map(item => <Message msg={item.msg} key={item.id} />)}
      </div>
      <div id='form-div'>
        <form id='from' onSubmit={(e) => e.preventDefault()}>
          <input id='input'
            placeholder='...'
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
