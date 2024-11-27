"use client"
import { useSession } from "next-auth/react"

const ChatNav = ({userImage, userName}) => {
    const { data: session} = useSession();
    const name = userName.split("#")[0]
  return (
    <div className = "flex justify-between p-4 shadow items-center">
      <div className = "flex items-center">
        <img src = {userImage} className="w-20 rounded-full ml-20" alt = {`${name}'s profile`}></img>
        <h1 className = "text-xl font-bold ml-4">{userName}</h1>
      </div>
      
    </div>
  )
}

export default ChatNav