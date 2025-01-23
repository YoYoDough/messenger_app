"use client"
import { useSession } from "next-auth/react";
import ChatNav from "./ChatNav"
import {useState, useEffect, useRef } from 'react'
import { useSocket } from "./SocketProvider";


const ChatComponent = ({conversation, setConversation, setConversations, userId, selfId, userName, userImage}) => {
  
  const {data: session} = useSession()
  console.log(session)

  const socket = useSocket()
  console.log(socket)

  console.log(conversation)
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const bottomOfChat = useRef(null);
  
  console.log(messages);

  const name = userName.split("#")[0];

  console.log(session?.user.name);
  
  useEffect(() => {
    if (!socket || !conversation) return;
    // Handle receiving a message
    const handleReceiveMessage = (message) => {
        // Ensure the message is for the active conversation
        // Fixed error where user would send message and see their own message twice, users only see new messages when they receive messages here
        if (message.senderId !== selfId){
          if (message.conversation.id === conversation.id) {
            setMessages((prev) => [...prev, message]);
          }
        }
    };

    // Listen for messages
    socket.on("receiveMessage", handleReceiveMessage);

    // Cleanup function to remove the listener
    return () => {
        socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, conversation])

  //Need to fetch previous messages next...
  useEffect(() => {
    async function fetchMessages() {
      if (conversation === null){
        return;
      }
      if (messages === null){
        return;
      }
      const response = await fetch(`http://localhost:8080/api/messages/withconvo?conversationid=${conversation.id}`)
      const data = await response.json();
      setMessages(data);
    }
    fetchMessages();
  }, [conversation])

  console.log(messages);

  useEffect(() => {
      bottomOfChat.current?.scrollIntoView({ behavior: 'smooth' }); // Scroll smoothly to the bottom of messages on page load
  }, [messages]);
  

  const sendMessage = async(conversation) => {
    let newConversation = null;
    // Step 1: Create the conversation if there is none fetched in the first place
    if (conversation == null){
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
      else{
        newConversation = await response.json();
      }
    }

    const targetedConversation = newConversation !== null ? newConversation : conversation;
    setConversation(targetedConversation)
    
    const response = await fetch("http://localhost:8080/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationId: targetedConversation.id,
        senderId: selfId,
        input: input,
      })
    })
    console.log("POST request completed, ", response)
    
    console.log(conversation);
    
    if (input.trim()){
      if (socket) {
        // Emit joinConversation to ensure the receiver is in the correct room
        socket.emit("joinConversation", targetedConversation.id);

        socket.emit("sendMessage", { conversation: targetedConversation, sentAt: new Date().toISOString(), senderId: selfId, content: input}); // Pass relevant data.
        setMessages((prev) => [...prev, { conversation: targetedConversation, sentAt: new Date().toISOString(), senderId: selfId, content: input, }]); // Update local state.
        setConversations((conversations) => {
          const updatedConversations = conversations.map((currentConversation) =>
            currentConversation.conversationId === targetedConversation.id
              ? { ...currentConversation, lastMessageSentAt: new Date().toISOString(), senderId: selfId, lastMessageText: input}
              : currentConversation
          );

          // Add the new conversation if it's not already in the array
          if (!updatedConversations.find((conv) => conv.conversationId === targetedConversation.id)) {
            const { id, createdAt, user1, user2 } = targetedConversation;
            updatedConversations.push({
              conversationId: id, // Rename id to conversationId
              user1: user1,
              user2: user2,
              senderId: selfId,
              lastMessageText: input, // Add new conversation with the last message text
              lastMessageSentAt: new Date().toISOString(),
              createdAt: createdAt,
            });
          }
          console.log("Updated Conversations:", updatedConversations);
          return updatedConversations;
        })
        console.log()
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
        {messages.map((msg, index) => {
          const showProfile = index === 0 || new Date(msg.timestamp) - new Date(messages[index - 1].timestamp) > 2 * 60 * 1000 ||messages[index - 1].userId !== msg.userId;
          const userConnectedToSender = msg.senderId === msg.conversation.user1.id ? msg.conversation.user1 : msg.conversation.user2
          return(
          <div>
            
              <div className = "flex items-center mb-2">
                <img className = "w-12" src = {userConnectedToSender.image}></img>
                <p className = "flex">{userConnectedToSender.name.split("#")[0]} {msg.sentAt}</p>
              </div>
            
            
            <div
              key={index}
              className={`inline-block w-fit max-w-[80%] p-3 rounded-md mb-1 text-black ${
                msg.senderId !== selfId ? "bg-gray-300 self-end" : "bg-blue-500 text-white"
              } break-words`}
            >
              
              {msg.content}
            </div>
          </div>
          );
        })}

        <div ref={bottomOfChat} /> {/* For useRef to automatically scroll to the bottom for recent messages on each render */}
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
          onKeyDown={(e) => {if (e.key === "Enter") sendMessage(conversation)}}
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