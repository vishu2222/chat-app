import { useState, useEffect } from 'react'
import { getRooms, getGeneralRoomMsgs } from '../requests.js'

export function ChatRooms() {
  const [roomsList, setRoomsList] = useState([])
  const [messages, setMessages] = useState([])

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

  useEffect(() => {
    console.log('roomsList:', roomsList, 'messages:', messages)
  }, [roomsList, messages])

  return (
    <div id='chatRooms'>
      <p>Welcome {localStorage.getItem('userName')}</p>
      <div id='rooms'></div>
      <div id='messages-container'></div>
      <div id='join-room'></div>
    </div>
  )
}
