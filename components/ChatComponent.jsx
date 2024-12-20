"use client"
import { useSession } from "next-auth/react";
import ChatNav from "./ChatNav"
import {useState, useEffect } from 'react'
import { io } from "socket.io-client"

let socket;

const ChatComponent = ({userId, selfId, userName, userImage}) => {
  const {data: session} = useSession()
  console.log(session)
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  
  console.log(messages);

  const name = userName.split("#")[0];

  console.log(session?.user.name);
  
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

  const sendMessage = async() => {
    // Step 1: Create or get the conversation
    const response = await fetch("http://localhost:8080/api/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user1Id: selfId, // Replace with your user ID
        user2Id: userId, // Replace with the recipient's user ID
      }),
    });

    if (!response.ok) {
      console.error("Failed to create conversation");
      return;
    }
    console.log(response.ok);
    const conversation = await response.json();
    console.log(conversation);
    if (input.trim()){
      if (socket) {
        socket.emit("sendMessage", { conversationId: conversation.id,text: input, selfName: session?.user.name, selfImage: session?.user.image, userId, userName }); // Pass relevant data.
        setMessages((prev) => [...prev, { conversationId: conversation.id, text: input, selfName: session?.user.name, selfImage: session?.user.image, userId, userName }]); // Update local state.
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
      <div key = {userId} className="flex-1 flex flex-col gap-2 overflow-y-auto p-4">
        {messages.map((msg, index) => {
          const showProfile = index === 0 || new Date(msg.timestamp) - new Date(messages[index - 1].timestamp) > 2 * 60 * 1000 ||messages[index - 1].userId !== msg.userId;
          return(
          <div>
            { showProfile &&
              <div className = "flex items-center mb-2">
                <img className = "w-10" src = {msg.selfImage}></img>
                <p>{msg.mySelf}</p>
                {}
              </div>
            }
            
            <div
              key={index}
              className={`inline-block w-fit max-w-[80%] p-3 rounded-md mb-2 ${
                msg.userId === selfId ? "bg-gray-300 self-end" : "bg-blue-500 text-white"
              } break-words`}
            >
              
              {msg.text}
          </div>
          </div>
          );
        })}
      </div>
      
      {/* Input Area */}
      <div className="flex p-4 shadow items-center">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="image-upload"
          onChange={(e) => handleImageUpload(e)}
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          <img src="upload-icon.png" alt="Upload Image" className="w-6 h-6 mr-4" />
        </label>
        
        <input
          type="text"
          value={input}
          onKeyDown={(e) => {if (e.key === "Enter") sendMessage()}}
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