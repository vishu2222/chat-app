import { useEffect } from 'react';
import { useState } from 'react';
import { MessageItem } from './MessageItem';

export function MsgBox({ socket, userName, room }) {
  const [newMessage, setNewMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  // methods
  function handleClick() {
    const newMsg = {
      userName: userName,
      room: room,
      txt: newMessage,
      date: new Date()
    };
    setMessageList([...messageList, newMsg]);
    socket.emit('newMessage', newMsg);
    setNewMessage('');
  }

  useEffect(() => {
    const callBack = (data) => {
      console.log('broadCast', data.userName, data.txt);
      setMessageList((currentList) => [...currentList, data]);
    };
    socket.on('broadcastMsg', callBack);
    return () => {
      socket.off('broadcastMsg', callBack);
    };
  }, [socket]);

  // component return
  return (
    <div id="messageBox">
      <h2>You are inside Room: {room}</h2>

      <div id="message-container">
        {messageList.map((msg, index) => (
          <MessageItem msg={msg} key={index} userName={userName} />
        ))}
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="...."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleClick}>send</button>
      </form>
    </div>
  );
}
