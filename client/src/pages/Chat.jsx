import { io } from 'socket.io-client'
import { useState, useEffect } from 'react'
import { MsgBox } from './MsgBox'
import { useLocation } from 'react-router-dom'
import { getUserChatByRooms } from '../requests'

const socket = io.connect('http://localhost:3000')

export function Chat() {
  const location = useLocation()
  const [userName, setUserName] = useState(location.pathname.split('/')[2])
  const [messages, setMessages] = useState({})

  useEffect(() => {
    socket.on('connect', () => {
      console.log('new user connected with id:', socket.id)
    })
  }, [])

  useEffect(() => {
    const userChat = async () => {
      const fetchedMessages = await getUserChatByRooms(userName)
      setMessages(() => fetchedMessages)
    }
    userChat()
  }, [userName])

  return (
    <div id="chat-page">
      <h3>Chat here</h3>
      <MsgBox messages={messages} userName={userName} socket={socket} />
    </div>
  )
}
