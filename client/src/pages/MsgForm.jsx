import { useState, useContext } from 'react'
import { AppContext } from './ChatRooms'
import '../styles/MsgForm.css'

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
      <form id='msg-form' onSubmit={(e) => e.preventDefault()}>
        <input id='msg-input' type='text' placeholder='message' value={newMsgTxt} onChange={(e) => setNewMsgTXT(e.target.value)} />
        <button id='msg-button' onClick={sendMsg}>
          send
        </button>
      </form>
    </div>
  )
}
