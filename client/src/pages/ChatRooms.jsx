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
  const [focusedRoomName, setFocusedRoomName] = useState('general')
  const [displayErr, setDisplayErr] = useState(false)
  const [errMsg, setErrMsg] = useState('')

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
      setDisplayErr(false)
      socket.emit('join', { roomId: 1 })
    })

    socket.on('connect_err', (err) => {
      setDisplayErr(true)
      setErrMsg(err.message)
    })

    socket.on('connect_error', (err) => {
      setDisplayErr(true)
      setErrMsg(err.message)
    })

    socket.on('error', (err) => {
      setDisplayErr(true)
      setErrMsg(err.message)
    })

    socket.on('disconnect', () => {
      console.log('disconnected')
      setDisplayErr(true)
      setErrMsg('server disconnected')
    })

    socket.on('broadcastMsg', (msg) => {
      setMessages((current) => [...current, msg])
    })

    return () => {
      socket.off('connect')
      socket.off('connect_err')
      socket.off('connect_error')
      socket.off('broadcastMsg')
      socket.off('disconnect')
      socket.off('error')
    }
  }, [])

  return (
    <AppContext.Provider value={{ roomsList, setRoomsList, messages, setMessages, socket, focusedRoomName, setFocusedRoomName }}>
      <>
        {displayErr && <h3 className='err-msg'>{errMsg}</h3>}
        <div id='div-chat-room'>
          <RoomsContainer />
          <MessageContainer />
          <NewRoom />
        </div>
      </>
    </AppContext.Provider>
  )
}
