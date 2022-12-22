import { useState } from "react";

export function JoinRoom({ joinUser }) {
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");

  function handleClick() {
    joinUser(userName, room);
    setUserName("");
    setRoom("");
  }

  return (
    <div id="join-room">
      <input
        type="text"
        placeholder="User Name"
        onChange={(e) => setUserName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Room"
        onChange={(e) => setRoom(e.target.value)}
      />
      <button onClick={handleClick}>Join</button>
    </div>
  );
}
