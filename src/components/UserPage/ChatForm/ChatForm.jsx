import React, { useState, useEffect } from "react";

function ChatForm({ socket }) {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("sending message:", message);
    socket.emit("chat message", message);
  };

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setMessageList([...messageList, msg]);
    });
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="send a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></input>
        <button type="submit">SEND</button>
      </form>
      <ul>
        {messageList.map((message, i) => (
          <li key={i}>{message}</li>
        ))}
      </ul>
    </>
  );
}

export default ChatForm;
