import { useState, useEffect, createContext } from 'react'
import { getRooms, getGeneralRoomMsgs } from '../requests.js'
import { io } from 'socket.io-client'
import { DisplayRooms } from './DisplayRooms.jsx'
import { MessageContainer } from './MessageContainer.jsx'
import './../styles/ChatRooms.css'

export const AppContext = createContext()

export function ChatRooms() {
  const [roomsList, setRoomsList] = useState([])
  const [messages, setMessages] = useState([])

  // fetching rooms and messages
  useEffect(() => {
    async function roomsList() {
      const rooms = await getRooms()
      setRoomsList(() => rooms)
    }

    async function generalRoomMsgs() {
      const generalMsgs = await getGeneralRoomMsgs()
      setMessages(() => generalMsgs)
    }

    roomsList()
    generalRoomMsgs()
  }, [])

  // setting up sockets
  useEffect(() => {
    const socket = io('http://localhost:3000', { autoConnect: false, transports: ['websocket'] }) // disables the HTTP long-polling transport
    socket.connect()

    socket.on('connect', () => {
      console.log('socket connection established')
    })

    socket.on('connect_err', (err) => {
      console.log('socket failed to connect, err:', err)
      // navigate(`/login`)
    })

    return () => {
      socket.off('connect')
      socket.off('connect_err')
    }
  }, [])

  return (
    <AppContext.Provider value={{ roomsList, messages }}>
      <div id='div-chat-room'>
        <DisplayRooms />
        <MessageContainer />
      </div>
    </AppContext.Provider>
  )
}
