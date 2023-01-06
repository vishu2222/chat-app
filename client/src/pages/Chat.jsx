import { io } from 'socket.io-client'
import { useState, useEffect, createContext } from 'react'
import { MsgBox } from './MsgBox'
import { Rooms } from './Rooms'
import { useNavigate } from 'react-router-dom'
import { getChatByRoom } from '../requests'
import { JoinRoom } from './JoinRoom'

const socket = io('http://localhost:3000', { autoConnect: false, transports: ['websocket'] }) // disables the HTTP long-polling transport

export const AppContext = createContext()

export function Chat() {
  const userName = useState(window.localStorage.getItem('userName'))[0]
  const [messages, setMessages] = useState({})
  const [focusedRoomId, setFocusedRoomId] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    socket.connect()

    socket.on('connect', () => {
      async function userChat() {
        const fetchedMessages = await getChatByRoom()
        setMessages(() => fetchedMessages)
      }
      userChat()
    })

    socket.on('connect_err', (err) => {
      console.log('socket failed to connect, err:', err)
      navigate(`/login`)
    })

    return () => {
      socket.off('connect')
      socket.off('connect_err')
    }
  }, [navigate])

  return (
    <div id='chat-page'>
      <div id='chat-title'>
        <h3>Welcone {userName}</h3>
        <h3>you roomID {focusedRoomId}</h3>
      </div>
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
