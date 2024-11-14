"use client"
import { useSession } from "next-auth/react"

const OnlineNav = () => {
    const { data: session} = useSession();
  return (
    <nav>
        <img src = {session.user.image}></img>
        <div className = "w-3 bg-green"></div>
    </nav>
  )
}

export default OnlineNav