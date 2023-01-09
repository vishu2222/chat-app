import { AppContext } from './ChatRooms'
import { useContext } from 'react'
import { MessageItem } from './MessageItem'

export function MessageContainer() {
  const { messages } = useContext(AppContext)
  //   console.log('messages', messages)
  return (
    <div id='message-container'>
      <p>messge-container</p>
      {messages.map((msg) => (
        <MessageItem key={msg.msg_id} msg={msg} />
      ))}
    </div>
  )
}
