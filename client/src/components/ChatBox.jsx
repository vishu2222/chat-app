import { useState } from "react";
// import { Message } from "./Message.jsx";

export function ChatBox({ msg }) {
  const [chatTxt, setChatTxt] = useState("");

  function sendMsg() {
    msg(chatTxt);
    setChatTxt("");
  }

  return (
    <div id="chat-box">
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="..."
          value={chatTxt}
          onChange={(e) => setChatTxt(e.target.value)}
        />
        <button onClick={sendMsg}>send</button>
      </form>
    </div>
  );
}
