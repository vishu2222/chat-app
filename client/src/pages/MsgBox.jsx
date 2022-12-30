import { useEffect, useContext } from 'react'
import { useState } from 'react'
import { AppContext } from './Chat'
import { DisplayMsg } from './DisplayMsg'

export function MsgBox() {
  const { messages, userName, socket, focusedRoom } = useContext(AppContext)
  const [newMessage, setNewMessage] = useState('')
  const [roomMessages, setRoomMessages] = useState([])

  function sendMessage() {
    // Todo
  }

  useEffect(() => {
    setRoomMessages(() => messages[focusedRoom])
  }, [focusedRoom])

  return (
    <div id="messageBox">
      <div id="message-container">
        <DisplayMsg roomMessages={roomMessages} />
        <form id="msg-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="...."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button onClick={sendMessage}>send</button>
        </form>
      </div>
    </div>
  )
}

// return () => {
//   socket.off('broadcastMsg', callBack);
// };
