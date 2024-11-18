import ChatNav from "./ChatNav"
import {useState, useEffect } from 'react'
import { io } from "socket.io-client"

let socket;

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket = io();
    console.log(socket)
    socket.on("receiveMessages", (message) => {
      setMessages((prev)=> [...prev, message]);
    })

    return ()=>{
      socket.disconnect();
    }
  }, [])

  const sendMessage = () => {
    if (input.trim()){
      socket.emit("sendMessage", input);
      setMessages((prev) => [...prev, input]);
      setInput("");
    }
  }
  return (
    <div>
      <ChatNav></ChatNav>
      <div>
        {messages.map((msg, index) => (
          <p key = {index}>{msg}</p>
        ))}
      </div>
      <input type = "text" value = {input} onChange={(e)=> setInput(e.target.value)}>
      
      </input>
      <button onClick = {sendMessage}>
        Send
      </button>
    </div>
  )
}

export default ChatComponent