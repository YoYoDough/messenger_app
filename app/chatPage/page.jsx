"use client"
import { use, useRef, useEffect, useState } from 'react';
import ChatComponent from "@components/ChatComponent";
import React from 'react'
import { useSelfId } from '@components/SelfIdProvider'
import { io } from "socket.io-client"
import { useSocket } from '@components/SocketProvider';

const page = ({searchParams}) => {
    const params = use(searchParams)
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState(null);
    const [userImage, setUserImage] = useState("");
    const [unreadMessages, setUnreadMessages] = useState({});

    const { selfId } = useSelfId() //get global state variable for one's own id in SelfIdProvider

    const [conversations, setConversations] = useState([]);
    const [conversation, setConversation] = useState();
    const socket = useSocket();

    console.log(socket)

    console.log(conversation, userName, userId, userImage);
    const joinedConversationRef = useRef(null); // Track the currently joined conversation

    useEffect(() => {
      if (!conversations || !conversation || !selfId) {
          return;
      }
  
      // Emit the event to join the conversation only if it's a new conversation
      if (joinedConversationRef.current !== conversation.id) {
          socket.emit("joinConversation", conversation.id);
          console.log(`Joined conversation: ${conversation.id}`);
          joinedConversationRef.current = conversation.id; // Update the ref
      }
  
      // Register the listener for receiving messages
      const handleReceiveMessage = (message) => {
          // Update unread messages count only for inactive conversations
          if (message.senderId !== selfId) {
              if (message.conversation.id !== conversation.id) {
                  setUnreadMessages((prev) => ({
                      ...prev,
                      [message.conversation.id]: (prev[message.conversation.id] || 0) + 1,
                  }));
              }
          }
  
          // Update the `lastMessageText` for the relevant conversation
          setConversations((prevConversations) => {
              const updatedConversations = prevConversations.map((currentConversation) =>
                  currentConversation.conversationId === message.conversation.id
                      ? {
                            ...currentConversation,
                            lastMessageText: message.content, // Update lastMessageText
                            lastMessageSentAt: message.sentAt, // Optionally update timestamp
                        }
                      : currentConversation
              );
  
              // If this is a new conversation (doesn't exist in the list), add it to the list
              if (!updatedConversations.find((conv) => conv.conversationId === message.conversation.id)) {
                  const { id, createdAt, ...conversationWithoutId } = message.conversation;
                  updatedConversations.push({
                      ...conversationWithoutId,
                      conversationId: id, // Rename id to conversationId
                      lastMessageSentAt: message.sentAt,
                      createdAt: createdAt,
                      senderId: message.senderId,
                      lastMessageText: message.content, // Add new conversation with the last message text
                  });
              }
  
              console.log("Updated Conversations:", updatedConversations);
              return updatedConversations; // Return the updated conversations array
          });
      };
  
      // Add the event listener
      socket.on("receiveMessage", handleReceiveMessage);
  
      // Cleanup function
      return () => {
          socket.off("receiveMessage", handleReceiveMessage); // Remove only the specific listener
      };
  }, [selfId, conversation, conversations, setConversations]);

    const handleConversationLoad = (id) => {
      setUnreadMessages((prev) => {
        return {
          ...prev,
          [id]: 0,
        }
      })
    }

    console.log("Unread Messages... ", unreadMessages)


  useEffect(() => {
    if (params.userName && params.userId && params.userImage){
      setUserName(params.userName);
      setUserId(params.userId)
      setUserImage(params.userImage);
    }
    else if (conversations.length > 0){
      const latestConversation = conversations[0];
      const { lastMessageText, lastMessageSentAt, conversationId, senderId, ...rest } = latestConversation;
      
      if (latestConversation.user1.id === selfId){
        setUserId(latestConversation.user2.id);
        setUserName(latestConversation.user2.name);
        setUserImage(latestConversation.user2.image);
      }
      else{
        setUserId(latestConversation.user1.id);
        setUserName(latestConversation.user1.name);
        setUserImage(latestConversation.user1.image);
      }
    }
  }, [params, conversations])

  console.log(userId)

  useEffect(()=> {
    const fetchUserHasConvo = async() => {
      if (!selfId || !userId){
        return;
      }
      const response = await fetch("http://localhost:8080/api/conversations/getconvo", {
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
        console.log("Failed to fetch conversation: ", response.statusText);
        return;
      }
      console.log(response.ok);
      const conversation = await response.json();
      setConversation(conversation);
      return conversation;
    }
    fetchUserHasConvo()
  }, [selfId, userId])

  // Fetch conversations once selfId is available
  useEffect(() => {
    const fetchConversations = async () => {
      if (!selfId) return;

      try {
        const response = await fetch(`http://localhost:8080/api/conversations/${selfId}`);
        if (!response.ok) {
          console.error("Failed to fetch conversations");
          return;
        }
        const data = await response.json();
        setConversations(data);
      } catch (error) {
        console.error("Error running fetchConversations:", error);
      }
    };

    fetchConversations();
  }, [selfId]);


    console.log(selfId)
    console.log(conversations);
    console.log(conversation)

    const handleConversationClick = (conversation) => {
      const { lastMessageText, lastMessageSentAt, conversationId, senderId, ...rest } = conversation; // Exclude properties
      const filteredConversation = {
        ...rest,
        id: conversationId,
      }
      handleConversationLoad(conversationId)
      setConversation(filteredConversation)
    }

  return (
    <div className = "flex w-full">
      <div className = "w-96">
        {conversations.map((conversation) => {
          const otherUser = conversation.user1.id === selfId ? conversation.user2 : conversation.user1;

          return (
            <div key = {conversation.id} className = "flex flex-col justify-center p-3 hover:bg-gray-400 cursor-pointer" onClick = {() => handleConversationClick(conversation)}>
              <div className = "flex items-center">
                <img className = "w-12 rounded-full mr-4" src = {otherUser.image || "defualtUserImg.png"} alt = {`${otherUser.name}'s Avatar'`}></img>
                <p>{otherUser.name}</p>
              </div>
              
              <div className = "flex mt-3 items-center p-1">
                {conversation.senderId === selfId && conversation.lastMessageText !== "" 
                  ? `You: ${conversation.lastMessageText}` 
                  : conversation.user1.id !== selfId 
                    ? `${conversation.user1.name}: ${conversation.lastMessageText}`
                    : `${conversation.user2.name}: ${conversation.lastMessageText}`
                }

                {/* Display unread badge if there are unread messages */}
                {unreadMessages[conversation.conversationId] > 0 && (
                  <span className="badge">{unreadMessages[conversation.conversationId]}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
      
      <ChatComponent socket = {socket} conversation = {conversation} setConversation = {setConversation} setConversations = {setConversations} userId = {userId} selfId = {selfId} userName = {userName} userImage = {userImage}></ChatComponent>
    </div>
  )
}

export default page