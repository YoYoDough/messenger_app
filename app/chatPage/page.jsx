"use client"
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import ChatComponent from "@components/ChatComponent";
import React from 'react'
import { useSession } from '@node_modules/next-auth/react';

const page = ({searchParams}) => {
    const params = use(searchParams)
    const{data: session} = useSession();
    const {userName, userId, userImage} = params
    const selfNameProp = session?.user.name.split("#")[0];
    const selfTagProp = "#" + session?.user.name.split("#")[1];
    const [selfId, setSelfId] = useState(null);
    const [conversations, setConversations] = useState([]);
    console.log(userName, userId, userImage);

    const getSelfId = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/users/self", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: selfNameProp,
            tag: selfTagProp
          }
        )});
  
        if (!response.ok) {
          console.error("Failed to fetch selfId:", response.status);
          return;
        }
  
        const data = await response.json(); // Parse JSON data
        setSelfId(data); // Set your selfId here
      } catch (error) {
        console.error("Error fetching selfId:", error);
      }
    };
  
    getSelfId();
    console.log(selfId)

    useEffect(() => {
      const fetchConversations = async() => {
        const response = await fetch(`http://localhost:8080/api/conversations/${selfId}`)
        const data = await response.json();
        console.log(data);
      }
      fetchConversations()
    }, [selfId])

    if (!userId || !userName || !userImage) {
      return <div>Loading...</div>; // Handle case where query params are not ready
    }

  return (
      <ChatComponent userId = {userId} selfId = {selfId} userName = {userName} userImage = {userImage}></ChatComponent>
  )
}

export default page