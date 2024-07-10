import "./App.css";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import { nanoid } from "nanoid";

const socket = io.connect("http://localhost:5000");
const userName = nanoid(4);

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("chat", (payload) => {
      setChat([...chat, payload]);
    });
  });

  const sendChat = (e) => {
    e.preventDefault();
    socket.emit("chat", { message, userName });
    setMessage("");
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="form-container">
          <h1>Chatty App</h1>
          <form onSubmit={sendChat} className="chat-form">
            <input
              type="text"
              name="chat"
              placeholder="Type message..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
            <button type="submit">Send</button>
          </form>
        </div>
        <div className="chat-container">
          {chat.map((payload, index) => (
            <p key={index} className="chat-message">
              {payload.userName}: {payload.message}
            </p>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
