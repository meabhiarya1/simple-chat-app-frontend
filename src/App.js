import "./App.css";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import { nanoid } from "nanoid";
import axios from "axios";

const ip = process.env.REACT_APP_IP;
const port = process.env.REACT_APP_PORT;

const socket = io.connect(`${ip}`);
// const userName = nanoid(4);

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [name, setName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    socket.on("chat", (payload) => {
      setChat([...chat, payload]);
    });
  });

  useEffect(() => {
    const fetchedData = async () => {
      try {
        const response = await axios.get(`${ip}/getconnection`);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchedData();
  }, []);

  const sendChat = (e) => {
    e.preventDefault();
    if (!isSubmitted && name !== "") {
      setIsSubmitted(!isSubmitted);
    }
    if (message !== "" && name !== "") {
      socket.emit("chat", { message, name });
      setMessage("");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="form-container">
          <h1>Chatty App</h1>
          <form onSubmit={sendChat} className="chat-form">
            <input
              type="text"
              name="name"
              placeholder="Type your name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitted}
            />
            <input
              type="text"
              name="chat"
              placeholder="Type message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </div>
        <div className="chat-container">
          {chat.map((payload, index) => (
            <p key={index} className="chat-message">
              {payload.name}: {payload.message}
            </p>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
