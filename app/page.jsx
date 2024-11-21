"use client"
import Image from "next/image";
import LandingPage from '@components/LandingPage'
import { useSession } from "next-auth/react";
import { useState, useEffect} from 'react'
import ChatComponent from "@components/ChatComponent";
import Link from "next/link";

export default function Home() {
  const {data: session} = useSession();
  const [conversations, setConversations] = useState([]);

  useEffect(()=>{
    const fetchConversations = async() =>{
      const response = await fetch(`http://localhost:8080/api/messages/conversations?email=${session?.user.email}`);
      const data = await response.json();
      setConversations(data);
    }
  }, [])

  console.log(session)
  
  return (
    <div className = "flex flex-col">
        {!session?.user && <LandingPage></LandingPage>}
        {session?.user && <div className = "conversations p-10 m-10"> 
          {conversations.length === 0 && <>
            <h1 className = "head_text">Get started creating messages!</h1>
            <p>Get started by making friends <Link className = "block mt-5 underline-offset-4 hover:underline md:inline-block dark:hover:text-neutral-300  dark:text-neutral-300" href = "/findFriends">here</Link></p>
          </>}
          {conversations.map((convo) => (
            <div className = "flex">
              <img src = {conversations.receiverImg}></img>
              <div className = "flex flex-col">
                <h3></h3>
                <p></p>
              </div>
            </div>
          ))}
        </div>}
    </div>
  );
}
