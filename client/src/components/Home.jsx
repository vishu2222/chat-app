import { useState, useEffect } from "react";

export function Home({ socket, setUserJoined, assignUser }) {
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");

  function handleClick() {
    socket.emit("joinRoom", { userName: userName, room, room });
    assignUser(userName, room);
    setUserJoined(true);
    setUserName("");
    setRoom("");
  }

  useEffect(() => {
    socket.on("userJoined", (data) => {
      console.log(data);
    });
  }, []);

  // component return
  return (
    <div id="Home">
      <h2>Join Chat</h2>
      <label>
        <strong>UserName:</strong>
      </label>
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <label>
        <strong>Room:</strong>
      </label>
      <input
        type="text"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />
      <button onClick={handleClick}>Join</button>
    </div>
  );
}
