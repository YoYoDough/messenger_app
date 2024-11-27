"use client"
import { useRouter } from 'next/navigation';
import { use } from 'react';
import ChatComponent from "@components/ChatComponent";
import React from 'react'

const page = ({searchParams}) => {
    const params = use(searchParams)
    const {userName, userId, userImage} = params
    console.log(userName, userId, userImage);

    if (!userId || !userName || !userImage) {
      return <div>Loading...</div>; // Handle case where query params are not ready
    }

  return (
      <ChatComponent userId = {userId} userName = {userName} userImage = {userImage}></ChatComponent>
  )
}

export default page