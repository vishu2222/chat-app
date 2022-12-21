import './App.css';
import { io } from 'socket.io-client'
import { ChatBox } from './components/ChatBox';

function App() {
  const socket = io('http://localhost:3000')

  socket.on('connect', () => {
    console.log('connected with id', socket.id)
  })

  function sendMessage(chatTxt) {
    socket.emit('newMessage', chatTxt)
  }

  socket.on('newBroadcast', (msg) => {
    console.log('BroadCast from server:', msg)
  })

  return (
    <div className="App" id='app-container'>
      <ChatBox msg={sendMessage} />
    </div>
  );
}

export default App;
