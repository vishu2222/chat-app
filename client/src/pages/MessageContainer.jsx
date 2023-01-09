import '../styles/MessageContainer.css'
import { AppContext } from './ChatRooms'
import { useContext } from 'react'
import { MessageItem } from './MessageItem'
import { MsgForm } from './MsgForm'

export function MessageContainer() {
  const { messages } = useContext(AppContext)

  return (
    <div id='message-container'>
      <p>messge-container</p>
      {messages.map((msg) => (
        <MessageItem key={msg.msg_id} msg={msg} />
      ))}
      <MsgForm />
    </div>
  )
}
