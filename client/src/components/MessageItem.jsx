export function MessageItem({ msg, userName }) {
  let divClassName = '';
  let msgClassName = '';
  if (msg.userName === userName) {
    divClassName = 'self-msg-div';
    msgClassName = 'self-msg';
  } else {
    divClassName = 'user-msg-div';
    msgClassName = 'user-msg';
  }
  return (
    <div className={divClassName}>
      <p className={msgClassName}>{msg.userName + ': ' + msg.txt}</p>
    </div>
  );
}
