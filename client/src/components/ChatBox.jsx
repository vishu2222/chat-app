import { useState } from "react";

export function ChatBox({ sendNewMessage }) {
  const [chatTxt, setChatTxt] = useState("");

  function sendMsg() {
    sendNewMessage(chatTxt);
    setChatTxt("");
  }

  return (
    <>
      <div id="txt-box">
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="...type here"
            value={chatTxt}
            onChange={(e) => setChatTxt(e.target.value)}
          />
          <button onClick={sendMsg}>send</button>
        </form>
      </div>
    </>
  );
}
