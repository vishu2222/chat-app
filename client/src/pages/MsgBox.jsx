import { useEffect } from 'react'
import { useState } from 'react'

export function MsgBox({ socket, userName, messages }) {
  const [newMessage, setNewMessage] = useState('')
  const [rooms, setRooms] = useState([])

  function handleClick() {}

  useEffect(() => {
    const fetchedRooms = Object.keys(messages)
    setRooms((current) => [...current, ...fetchedRooms])
  }, [messages])

  return (
    <div id="messagePage">
      <div id="rooms">
        <h3>Rooms</h3>
      </div>
      <div id="messageBox">
        <div id="message-container">
          <form id="msg-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="...."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={handleClick}>send</button>
          </form>
        </div>
      </div>
    </div>
  )
}

// return () => {
//   socket.off('broadcastMsg', callBack);
// };
