import { useState, useContext } from 'react'
import { AppContext } from './ChatRooms'

export function MsgForm() {
  const [newMsgTxt, setNewMsgTXT] = useState('')
  const { socket, setMessages } = useContext(AppContext)

  function sendMsg() {
    if (newMsgTxt.trim() === '') return
    const newMsg = {
      msg_txt: newMsgTxt,
      user_name: localStorage.getItem('userName')
    }

    socket.emit('newMessage', newMsg)
    setNewMsgTXT(() => '')
    setMessages((current) => [...current, newMsg])
  }

  return (
    <div id='message-type-div'>
      <form onSubmit={(e) => e.preventDefault()}>
        <input type='text' placeholder='message' value={newMsgTxt} onChange={(e) => setNewMsgTXT(e.target.value)} />
        <button onClick={sendMsg}>send</button>
      </form>
    </div>
  )
}
