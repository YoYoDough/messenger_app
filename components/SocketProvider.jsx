import React, { createContext, useContext } from 'react'
import { io } from '@node_modules/socket.io-client/build/esm';

const SocketContext = createContext();

export const useSocket = useContext(SocketContext)

const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socketInstance = io("http://localhost:8081")
        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        }
    }, [])
  return (
    <SocketContext.Provider value = {socket}>
        {children}
    </SocketContext.Provider>
  )
}

export default SocketProvider