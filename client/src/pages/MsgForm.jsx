import { useState, useContext } from 'react'
import { AppContext } from './ChatRooms'
import '../styles/MsgForm.css'
import { useEffect, useRef } from 'react'

export function MsgForm() {
  const [newMsgTxt, setNewMsgTXT] = useState('')
  const { socket, setMessages } = useContext(AppContext)
  const msgPlaceHolder = useRef()

  function sendMsg() {
    if (newMsgTxt.trim() === '') return
    const newMsg = {
      msg_txt: newMsgTxt,
      user_name: localStorage.getItem('userName')
    }

    socket.emit('new-message', newMsg)
    setNewMsgTXT(() => '')
    setMessages((current) => [...current, newMsg])
  }

  useEffect(() => {
    socket.on('user-typying', () => {
      msgPlaceHolder.current.placeholder = '...Typing'
    })
    return () => socket.off('user-typying')
  }, [socket])

  useEffect(() => {
    const interval = setInterval(() => {
      msgPlaceHolder.current.placeholder = ''
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div id='message-type-div'>
      <form id='msg-form' onSubmit={(e) => e.preventDefault()}>
        <input
          id='msg-input'
          type='text'
          placeholder='message'
          ref={msgPlaceHolder}
          value={newMsgTxt}
          // on
          onChange={(e) => {
            setNewMsgTXT(e.target.value)
            socket.emit('typying', '')
          }}
        />
        <button id='msg-button' className='button' onClick={sendMsg}>
          send
        </button>
      </form>
    </div>
  )
}
