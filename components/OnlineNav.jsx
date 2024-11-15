"use client"
import { useSession } from "next-auth/react"

const OnlineNav = () => {
    const { data: session} = useSession();
  return (
    <nav className = "flex justify-between h-20">
        <div className = "flex items-left relative p-2">
            <img className = "flex  ml-4 w-30 rounded-full bg-transparent"src = {session.user.image}></img>
            <div className = "flex self-center justify-self-center absolute w-5 h-5 bg-green-400 rounded-full left-28 top-14"></div>
        </div>
        
        <div className = "w-3 bg-green"></div>
    </nav>
  )
}

export default OnlineNav