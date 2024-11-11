"use client"
import Image from "next/image";
import LandingPage from '@components/LandingPage'
import { useSession } from "next-auth/react";
import { useState } from 'react'

export default function Home() {
  const {data: session} = useSession();
  console.log(session)
  
  return (
    <div className = "flex flex-col w-full">
        {!session?.user && <LandingPage></LandingPage>}
    </div>
  );
}
