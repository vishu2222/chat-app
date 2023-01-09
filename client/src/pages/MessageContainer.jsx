import '../styles/MessageContainer.css'
import { AppContext } from './ChatRooms'
import { useContext } from 'react'
import { MessageItem } from './MessageItem'
import { MsgForm } from './MsgForm'
import { useState } from 'react'
import { useEffect } from 'react'

export function MessageContainer() {
  const { messages, socket } = useContext(AppContext)
  const [errMsg, setErrorMsg] = useState('')
  const [displayErr, setDisplayErr] = useState(false)

  useEffect(() => {
    socket.on('dberror', () => {
      setDisplayErr(true)
      setErrorMsg('failed to send Message')
    })
    return () => socket.off('dberror')
  }, [socket])

  useEffect(() => {
    console.log('messages', messages)
  }, [messages])

  return (
    <div id='form-msg-container'>
      <div id='message-container'>
        <p>messge-container</p>
        {messages.map((msg, index) => (
          <MessageItem key={index} msg={msg} />
        ))}
        {displayErr && <h3 className='err-msg'>{errMsg}</h3>}
      </div>
      <MsgForm />
    </div>
  )
}
