import { io } from 'socket.io-client'
import { useState, useEffect, createContext } from 'react'
import { MsgBox } from './MsgBox'
import { Rooms } from './Rooms'
import { useNavigate } from 'react-router-dom'
import { getUserChatByRoom } from '../requests'
import { JoinRoom } from './JoinRoom'

const socket = io('http://localhost:3000', { autoConnect: false, transports: ['websocket'] }) // disables the HTTP long-polling transport
socket.connect()

export const AppContext = createContext()

export function Chat() {
  const [userName, setUserName] = useState(window.localStorage.getItem('userName'))
  const [messages, setMessages] = useState({})
  const [focusedRoomId, setFocusedRoomId] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    socket.on('connect', () => {
      const userChat = async () => {
        const fetchedMessages = await getUserChatByRoom(userName) // change to getChatByRoom
        setMessages(() => fetchedMessages)
      }
      userChat()
    })

    socket.on('connect_err', (err) => {
      console.log('socket failed to connect, err:', err) // redirect to login
      // navigate(`/login`)
    })
  }, [])

  return (
    <div id='chat-page'>
      <h3>Chat here</h3>
      <div id='msgBox-rooms'>
        <AppContext.Provider
          value={{
            messages,
            setMessages,
            userName,
            socket,
            focusedRoomId,
            setFocusedRoomId
          }}>
          <JoinRoom />
          <MsgBox />
          <Rooms />
        </AppContext.Provider>
      </div>
    </div>
  )
}
