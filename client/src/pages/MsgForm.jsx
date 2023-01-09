import { useState, useContext } from 'react'
import { AppContext } from './ChatRooms'

export function MsgForm() {
  const [newMsgTxt, setNewMsgTXT] = useState('')
  const { socket } = useContext(AppContext)
  function sendMsg() {
    if (newMsgTxt.trim() === '') return
    const newMsg = {
      msg_txt: newMsgTxt
    }

    console.log(newMsg)
    socket.emit('newMessage', newMsg)
    setNewMsgTXT(() => '')
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
