import { useState, useEffect, createContext } from 'react'
import { getRooms, getGeneralRoomMsgs } from '../requests.js'
import { io } from 'socket.io-client'
import { RoomsContainer } from './RoomsContainer.jsx'
import { MessageContainer } from './MessageContainer.jsx'
import { NewRoom } from './NewRoom.jsx'
import './../styles/ChatRooms.css'

export const AppContext = createContext()
const socket = io('http://localhost:3000', { autoConnect: false, transports: ['websocket'] }) // disables the HTTP long-polling transport

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
    socket.connect()

    socket.emit('join-room', 1)

    socket.on('connect', () => {
      console.log('socket connection established')
      socket.emit('join', { roomId: 1 })
    })

    socket.on('connect_err', (err) => {
      console.log('socket failed to connect, err:', err)
      if (err.message === 'unauthorised') console.log('unauthorized')
    })

    socket.on('broadcastMsg', (msg) => {
      setMessages((current) => [...current, msg])
    })

    return () => {
      socket.off('connect')
      socket.off('connect_err')
      socket.off('broadcastMsg')
    }
  }, [])

  return (
    <AppContext.Provider value={{ roomsList, setRoomsList, messages, setMessages, socket }}>
      <div id='div-chat-room'>
        <RoomsContainer />
        <MessageContainer />
        <NewRoom />
      </div>
    </AppContext.Provider>
  )
}
