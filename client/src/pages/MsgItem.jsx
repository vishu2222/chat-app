import { useEffect, useContext } from 'react'
import { AppContext } from './Chat'

export function MessageItem({ msg }) {
  const { userName } = useContext(AppContext)
  let divClassName = ''
  let msgClassName = ''

  if (msg.user_name === userName) {
    divClassName = 'self-msg-div'
    msgClassName = 'self-msg'
  } else {
    divClassName = 'user-msg-div'
    msgClassName = 'user-msg'
  }

  useEffect(() => {
    console.log(msg)
  })
  return (
    <div className={divClassName}>
      <p className={msgClassName}>{msg.user_name + ': ' + msg.msg_txt}</p>
    </div>
  )
}
