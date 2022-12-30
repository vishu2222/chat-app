import { useState } from 'react'
import { useEffect } from 'react'
import { MessageItem } from './MsgItem'

export function DisplayMsg({ roomMessages }) {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    if (roomMessages !== undefined) {
      setMessages(() => roomMessages)
    }
  }, [roomMessages])

  useEffect(() => {
    messages.forEach((item) => console.log(item))
  }, [messages])

  return (
    <div>
      {messages.map((msg, index) => (
        <MessageItem key={index} msg={msg} />
      ))}
    </div>
  )
}
