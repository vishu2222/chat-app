export function MessageItem({ msg, userName }) {
  let className = '';
  if (msg.userName === userName) className = 'self-msg';
  else className = 'user-msg';
  return <div className={className}> {msg.userName + ': ' + msg.txt}</div>;
}
