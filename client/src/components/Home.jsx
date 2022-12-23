import { useState, useEffect } from 'react';

export function Home({ socket, setUserStatus, assignUser }) {
  const [userName, setUserName] = useState('');
  const [room, setRoom] = useState('');

  function handleClick() {
    if (userName === '' || room === '') return;
    socket.emit('joinRoom', { userName: userName, room: room });
    assignUser(userName, room);
    setUserStatus(true);
    setUserName('');
    setRoom('');
  }

  useEffect(() => {
    socket.on('userJoined', (data) => {
      console.log(data);
    });
  }, [socket]);

  // component return
  return (
    <div id="homeDiv">
      <form onSubmit={(e) => e.preventDefault()}>
        <h2> Join Chat</h2>
        <label>
          <strong> User Name: </strong>
        </label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

        <label>
          <strong> Room: </strong>
        </label>
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button onClick={handleClick}>Join</button>
      </form>
    </div>
  );
}
