"use client"
import { useSession } from "next-auth/react"

const ChatNav = ({userImage, userName}) => {
    const { data: session} = useSession();
  return (
    <nav className = "flex justify-between h-20">
      <img className = {"/defaultUserImg.png"}></img>
            <div className = "flex self-center justify-self-center absolute w-5 h-5 bg-green-400 rounded-full left-28 top-14"></div>
            <p>{userName}</p>
        
        <div className = "w-3 bg-green"></div>
    </nav>
  )
}

export default ChatNav