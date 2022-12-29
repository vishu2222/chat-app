import { io } from 'socket.io-client'
import { useState, useEffect } from 'react'
import { MsgBox } from './MsgBox'
import { useLocation } from 'react-router-dom'
import { useSocket } from '../hooks/useSocket'

const socket = io.connect('http://localhost:3000')

export function Chat() {
  const location = useLocation()
  const [userName, setUserName] = useState(location.pathname.split('/')[2])

  console.log(userName)

  useEffect(() => {
    socket.on('connect', () => {
      console.log('new user connected with id:', socket.id)
    })
  }, [])

  return (
    <div id="chat-page">
      <h3>Chat here</h3>
      <MsgBox />
    </div>
  )
}
