"use client"
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import ChatComponent from "@components/ChatComponent";
import React from 'react'
import { useSession } from '@node_modules/next-auth/react';

const page = ({searchParams}) => {
    const params = use(searchParams)
    const{data: session} = useSession();
    const { userName, userId, userImage } = params
    const selfNameProp = session?.user.name.split("#")[0];
    const selfTagProp = "#" + session?.user.name.split("#")[1];
    const [selfId, setSelfId] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [conversation, setConversation] = useState(null);
    console.log(conversation, userName, userId, userImage);

    // Fetch selfId
  useEffect(() => {
    const getSelfId = async () => {
      if (!selfNameProp || !selfTagProp) {
        console.warn("Session data is missing, cannot fetch selfId.");
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/api/users/self", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: selfNameProp,
            tag: selfTagProp,
          }),
        });

        if (!response.ok) {
          console.error("Failed to fetch selfId:", response.status);
          return;
        }

        const data = await response.json();
        setSelfId(data);
      } catch (error) {
        console.error("Error fetching selfId:", error);
      }
    };

    getSelfId();
  }, [selfNameProp, selfTagProp]);

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

    if (!userId || !userName || !userImage) {
      return <div>Loading...</div>; // Handle case where query params are not ready
    }

    const handleConversationClick = (conversation) => {
      setConversation(conversation)
    }

  return (
    <div className = "flex w-full">
      <div className = "w-96">
        {conversations.map((conversation) => {
          const otherUser = conversation.user1.id === selfId ? conversation.user2 : conversation.user1;

          return (
            <div key = {conversation.id} className = "flex justify-center p-3 hover:bg-gray-200 cursor-pointer" onClick = {() => handleConversationClick(conversation)}>
              <img src = {otherUser.image || "defualtUserImg.png"} alt = {`${otherUser.name}'s Avatar'`}></img>
              <div className = "flex">
                <p>{otherUser.name}</p>
                <p>{conversation.lastMessageText === "" ? "No Message Sent..." : conversation.lastMessageText}</p>
              </div>
            </div>
          )
        })}
      </div>
      
      <ChatComponent clickedConversation = {conversation} userId = {userId} selfId = {selfId} userName = {userName} userImage = {userImage}></ChatComponent>
    </div>
  )
}

export default page