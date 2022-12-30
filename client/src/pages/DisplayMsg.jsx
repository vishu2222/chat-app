import { useState } from 'react'
import { useEffect } from 'react'

export function DisplayMsg({ roomMessages }) {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    if (roomMessages !== undefined) {
      setMessages(() => roomMessages)
    }
    console.log(messages, Array.isArray(messages))
  }, [roomMessages])

  useEffect(() => {
    // messages.forEach((item) => console.log(item.msg_txt))
  }, [messages])

  const msgElements = messages.map((msg, index) => (
    <div className="msg" key={index}>
      <h5>{msg.msg_txt}</h5>
    </div>
  ))

  return (
    <div>
      <ul>{msgElements}</ul>
    </div>
  )
}
