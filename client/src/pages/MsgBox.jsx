import { useState } from 'react'

export function MsgBox({ socket, userName, room = 'None' }) {
  const [newMessage, setNewMessage] = useState('')
  const [messageList, setMessageList] = useState([])

  function handleClick() {}

  return (
    <div id="messageBox">
      <h2>You are inside Room: {room}</h2>

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
  )
}

// return () => {
//   socket.off('broadcastMsg', callBack);
// };
