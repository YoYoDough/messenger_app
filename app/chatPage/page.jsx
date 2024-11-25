"use client"
import { useRouter } from 'next/navigation';
import { use } from 'react';
import ChatComponent from "@components/ChatComponent";
import React from 'react'

const page = ({searchParams}) => {
    const params = use(searchParams)
    const {userName, userId, userImage} = params
    console.log(userName, userId, userImage);
  return (
    <div>
        <ChatComponent userId = {userId} userName = {userName} userImage = {userImage}></ChatComponent>
    </div>
  )
}

export default page