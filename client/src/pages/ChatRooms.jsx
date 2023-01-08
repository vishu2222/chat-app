import { useEffect } from 'react'
import { getRooms } from '../requests.js'

export function ChatRooms() {
  useEffect(() => {
    async function roomsList() {
      const rooms = await getRooms()
      console.log(rooms)
    }
    roomsList()
  }, [])

  return (
    <div id='chatRooms'>
      <p>Welcome {localStorage.getItem('userName')}</p>
      <div id='rooms'></div>
      <div id='messages-container'></div>
    </div>
  )
}
