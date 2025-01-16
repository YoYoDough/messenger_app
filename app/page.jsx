"use client"
import Image from "next/image";
import LandingPage from '@components/LandingPage'
import { useSession } from "next-auth/react";
import { useState, useEffect, useContext} from 'react'
import { useSelfId } from '@components/SelfIdProvider' 
import ChatComponent from "@components/ChatComponent";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()
  const {data: session} = useSession();
  const [conversations, setConversations] = useState([]);
  const {selfId, setSelfId} = useSelfId()
  console.log(selfId)

  useEffect(()=>{
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
    fetchConversations()
  }, [selfId])

  useEffect(() => {
    if (conversations && conversations.length > 0) {
      // Redirect to the chat page if there are conversations
      router.push('/chatPage'); // Redirect to chatPage
    }
  }, [conversations, router]);
  
  return (
    <div className = "flex flex-col">
        {!session?.user && <LandingPage></LandingPage>}
        {conversations.length === 0  && <div className = "conversations p-10 m-10"> 
          {conversations.length === 0 && <>
            <h1 className = "head_text">Get started creating messages!</h1>
            <p>Get started by making friends <Link className = "block mt-5 underline-offset-4 hover:underline md:inline-block dark:hover:text-neutral-300  dark:text-neutral-300" href = "/findFriends"><b>here</b></Link></p>
          </>}
        </div>}
    </div>
  );
}
