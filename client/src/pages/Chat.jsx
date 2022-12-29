import { io } from 'socket.io-client'
import { useState, useEffect } from 'react'
import { MsgBox } from './MsgBox'
import { useLocation } from 'react-router-dom'

export function Chat() {
  const location = useLocation()
  const [userName, setUserName] = useState(location.pathname.split('/')[2])
  console.log(userName)

  useEffect(() => {
    const socket = io.connect('http://localhost:3000')
    socket.on('connect', () => {
      console.log('new user connected with id:', socket.id)
    })
  }, [])

  return (
    <div id="chat-page">
      <h3>Chat</h3>
      <MsgBox />
    </div>
  )
}
