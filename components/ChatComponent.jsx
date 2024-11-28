"use client"
import { useSession } from "next-auth/react";
import ChatNav from "./ChatNav"
import {useState, useEffect } from 'react'
import { io } from "socket.io-client"

let socket;

const ChatComponent = ({userId, userName, userImage}) => {
  const {data: session} = useSession()
  console.log(session)
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selfId, setSelfId] = useState(0);
  console.log(messages);

  const name = userName.split("#")[0];

  console.log(session?.user.name);

  useEffect(() => {
    if (!session?.user.name) return;
    const getSelfId = async() => {
      const response = await fetch(`http://localhost:8080/api/users/self?name=${session?.user.name}`)
      const data = await response;
      setSelfId(prevId => prevId = data);
    }
    getSelfId();
  }, [session?.user.name])
  console.log(selfId);

  useEffect(() => {
    socket = io("http://localhost:8081");
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
      if (socket) {
        socket.emit("sendMessage", { text: input, userId, userName }); // Pass relevant data.
        setMessages((prev) => [...prev, { text: input, userId, userName }]); // Update local state.
        setInput(""); // Clear the input.
      } else {
        console.error("Socket not initialized!");
      }
    }
  }


  return (
    <div className = "flex flex-col w-full h-screen">
      <ChatNav userName = {userName} userImage = {userImage}></ChatNav>
      {/* Messages Area */}
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`inline-block w-fit max-w-[80%] p-3 rounded-md mb-2 ${
              msg.userId !== userId ? "bg-gray-300 self-end" : "bg-blue-500 text-white"
            } break-words`}
          >
            {msg.mySelf}
            {msg.selfImage}
            {msg.text}
          </div>
        ))}
      </div>
      
      {/* Input Area */}
      <div className="flex p-4 shadow">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 rounded-md outline-none bg-black bg-opacity-50 text-white placeholder-gray-200"
          placeholder={`Message @${name}`}
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatComponent