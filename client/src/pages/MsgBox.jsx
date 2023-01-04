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
    socket.on('connect', () => {
      console.log('new user connected with id:', socket.id)
    })
    return () => {
      socket.off('connect')
    }
  }, [socket])

  useEffect(() => {
    socket.on('newBroadcast', (msg) => {
      setNewBroadcast(() => msg)
      return () => socket.off('newBroadcast') //
    })
  }, [])

  useEffect(() => {
    if (Object.keys(broadCast).length > 0) {
      const tempMsgs = messages
      tempMsgs[focusedRoomId].push(broadCast)
      setMessages(tempMsgs)
      setRoomMessages((current) => [...current, broadCast])
      setNewMessage('')
    }
  }, [broadCast])

  function sendMessage() {
    const newMsg = {
      msg_txt: newMessage,
      msg_time: new Date(Date.now()).toISOString(),
      user_name: userName,
      roomId: focusedRoomId
    }
    socket.emit('newMessage', newMsg) // need to get confirmation from db

    const tempMsgs = messages
    tempMsgs[focusedRoomId].push(newMsg)
    setMessages(tempMsgs) // prevent new msg's from dissappearing after room refocus
    setRoomMessages((current) => [...current, newMsg]) // to trigger a render on current page
    setNewMessage('')
  }

  useEffect(() => {
    setRoomMessages(() => messages[focusedRoomId])
  }, [focusedRoomId])

  return (
    <div id='messageBox'>
      <div id='message-container'>
        <DisplayMsg roomMessages={roomMessages} />
        <form id='msg-form' onSubmit={(e) => e.preventDefault()}>
          <input type='text' placeholder='message' value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
          <button onClick={sendMessage}>send</button>
        </form>
      </div>
    </div>
  )
}

// useEffect(() => {
//   const callBack = (data) => {
//     console.log('broadCast', data.userName, data.txt);
//     setMessageList((currentList) => [...currentList, data]);
//   };
//   socket.on('broadcastMsg', callBack);
//   return () => {
//     socket.off('broadcastMsg', callBack);
//   };
// }, [socket]);
