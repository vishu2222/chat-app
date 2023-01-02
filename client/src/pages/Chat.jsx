import { io } from 'socket.io-client'
import { useState, useEffect, createContext } from 'react'
import { MsgBox } from './MsgBox'
import { Rooms } from './Rooms'
import { useLocation } from 'react-router-dom'
import { getUserChatByRoom } from '../requests'

const socket = io.connect('http://localhost:3000')
export const AppContext = createContext()

export function Chat() {
  const location = useLocation()
  const [userName, setUserName] = useState(location.pathname.split('/')[2])
  const [messages, setMessages] = useState({})
  const [focusedRoom, setFocusedRoom] = useState('')

  useEffect(() => {
    socket.on('connect', () => {
      console.log('new user connected with id:', socket.id)
    })
  }, [])

  useEffect(() => {
    const userChat = async () => {
      const fetchedMessages = await getUserChatByRoom(userName)
      setMessages(() => fetchedMessages)
    }
    userChat()
  }, [userName])

  return (
    <div id="chat-page">
      <h3>Chat here</h3>
      <div id="msgBox-rooms">
        <AppContext.Provider
          value={{ messages, userName, socket, focusedRoom, setFocusedRoom }}>
          <MsgBox />
          <Rooms />
        </AppContext.Provider>
      </div>
    </div>
  )
}
