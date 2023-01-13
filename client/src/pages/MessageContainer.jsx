import '../styles/MessageContainer.css'
import { AppContext } from './ChatRooms'
import { useContext } from 'react'
import { MessageItem } from './MessageItem'
import { MsgForm } from './MsgForm'
import { useEffect, useRef } from 'react'

export function MessageContainer() {
  const { messages, focusedRoomName } = useContext(AppContext)
  const msgContainerElement = useRef()

  useEffect(() => {
    msgContainerElement.current.scrollTop = msgContainerElement.current.scrollHeight // set verticall scroll length = total height of div content including overflow
  }, [messages])

  return (
    <div id='form-msg-container'>
      <div id='message-container' ref={msgContainerElement}>
        <div id='msg-container-title'>
          <div id='title-room'>
            <strong>{focusedRoomName}</strong>
          </div>
        </div>
        {messages.map((msg, index) => (
          <MessageItem key={index} msg={msg} />
        ))}
      </div>
      <MsgForm />
    </div>
  )
}
