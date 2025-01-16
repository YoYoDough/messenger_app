"use client"
import { useRouter } from 'next/navigation';
import { use, useContext, useEffect, useState } from 'react';
import ChatComponent from "@components/ChatComponent";
import React from 'react'
import { useSelfId } from '@components/SelfIdProvider'
import { useSession } from '@node_modules/next-auth/react';

const page = ({searchParams}) => {
    const params = use(searchParams)
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState(null);
    const [userImage, setUserImage] = useState("");

    const { selfId } = useSelfId() //get global state variable for one's own id in SelfIdProvider

    const [conversations, setConversations] = useState([]);
    const [conversation, setConversation] = useState();

    console.log(conversation, userName, userId, userImage);


  useEffect(() => {
    if (params.userName && params.userId && params.userImage){
      setUserName(params.userName);
      setUserId(params.userId)
      setUserImage(params.userImage);
    }
    else if (conversations.length > 0){
      const latestConversation = conversations[0];
      const { lastMessageText, lastMessageSentAt, conversationId, ...rest } = latestConversation;
      setConversation({
        ...rest,
        id: conversationId,
      })
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
        console.log("Failed to create conversation");
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
      const { lastMessageText, lastMessageSentAt, conversationId, ...rest } = conversation; // Exclude properties
      const filteredConversation = {
        ...rest,
        id: conversationId,
      }
      setConversation(filteredConversation)
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
      
      <ChatComponent conversation = {conversation} setConversation = {setConversation} setConversations = {setConversations} userId = {userId} selfId = {selfId} userName = {userName} userImage = {userImage}></ChatComponent>
    </div>
  )
}

export default page