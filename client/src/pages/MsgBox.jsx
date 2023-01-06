import { useEffect, useContext } from 'react'
import { useState } from 'react'
import { AppContext } from './Chat'
import { DisplayMsg } from './DisplayMsg'

export function MsgBox() {
  const { messages, setMessages, userName, socket, focusedRoomId } = useContext(AppContext)
  const [newMessage, setNewMessage] = useState('')
  const [roomMessages, setRoomMessages] = useState([])
  const [broadCast, setNewBroadcast] = useState({})

  useEffect(() => {
    socket.on('newBroadcast', (msg) => {
      setNewBroadcast(() => msg)
      return () => socket.off('newBroadcast') //
    })
  }, [socket])

  useEffect(() => {
    console.log('broadCast msg', broadCast)
    if (Object.keys(broadCast).length > 0) {
      const tempMsgs = messages
      console.log('tempMsgs', tempMsgs)
      tempMsgs[focusedRoomId].push(broadCast)
      setMessages(tempMsgs)
      setRoomMessages((current) => [...current, broadCast])
      setNewMessage('')
    }
  }, [broadCast, focusedRoomId, messages, setMessages])

  function sendMessage() {
    const newMsg = {
      msg_txt: newMessage,
      msg_time: Date.now(),
      user_name: userName,
      roomId: focusedRoomId
    }
    socket.emit('newMessage', newMsg) // need to get confirmation from db first

    const tempMsgs = messages
    tempMsgs[focusedRoomId].push(newMsg)
    setMessages(tempMsgs) // prevent new msg's from dissappearing after room refocus
    setRoomMessages((current) => [...current, newMsg]) // to trigger a render on current page
    setNewMessage('')
  }

  useEffect(() => {
    setRoomMessages(() => messages[focusedRoomId])
  }, [focusedRoomId, messages])

  return (
    <div id='messageBox'>
      <div id='message-container'>
        <DisplayMsg roomMessages={roomMessages} />
        <form id='msg-form' onSubmit={(e) => e.preventDefault()}>
          <input id='msg-input' type='text' placeholder='message' value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
          <button onClick={sendMessage}>send</button>
        </form>
      </div>
    </div>
  )
}
