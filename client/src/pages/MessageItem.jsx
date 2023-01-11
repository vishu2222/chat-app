import '../styles/MessageItem.css'

export function MessageItem({ msg }) {
  const userName = localStorage.getItem('userName')
  let divClassName = ''
  let msgClassName = ''

  if (msg.roomMsg) {
    divClassName = 'room-msg-div'
    msgClassName = 'room-msg'
  } else if (msg.user_name === userName) {
    divClassName = 'self-msg-div'
    msgClassName = 'self-msg'
  } else {
    divClassName = 'user-msg-div'
    msgClassName = 'user-msg'
  }

  return (
    <div className={divClassName}>
      <p className={msgClassName}>{msg.user_name + ': ' + msg.msg_txt}</p>
    </div>
  )
}
