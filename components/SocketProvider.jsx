import React, { useState, useEffect, createContext, useContext } from 'react'
import { io } from "socket.io-client"

const SocketContext = createContext();
export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        
      const newSocket = io("http://localhost:8082", {
          transports: ["websocket"], // Use WebSocket directly for stability
      });

      setSocket(newSocket);

        return () => {
          newSocket.disconnect();
          console.log("Socket disconnected during cleanup");
        }
    }, [])
  return (
    <SocketContext.Provider value = {socket}>
        {children}
    </SocketContext.Provider>
  )
}

export default SocketProvider


export const useSocket = () => useContext(SocketContext)