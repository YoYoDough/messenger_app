"use client"

import { SessionProvider, useSession } from 'next-auth/react'
import { createContext, useEffect, useState, useContext} from 'react'

const Context = createContext();

export const SelfIdProvider = ({children}) => {
    const [selfId, setSelfId] = useState(null);
    const {data: session } = useSession();


    const selfNameProp = session?.user.name.split("#")[0];
    const selfTagProp = "#" + session?.user.name.split("#")[1];

    useEffect(() => {
        const getSelfId = async () => {
            if (!selfNameProp || !selfTagProp) {
              console.warn("Session data is missing, cannot fetch selfId.");
              return;
            }

            const storedSelfId = localStorage.getItem('selfId');
            const expiration = localStorage.getItem('selfIdExpiration'); // Optional: Expiration time

            // If selfId exists and is valid, use it
            if (storedSelfId && expiration && Date.now() < expiration) {
                setSelfId(storedSelfId);
                return; // Skip the API call
            }
      
            try {
              const response = await fetch("http://localhost:8080/api/users/self", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: selfNameProp,
                  tag: selfTagProp,
                }),
              });
      
              if (!response.ok) {
                console.error("Failed to fetch selfId:", response.status);
                return;
              }
      
              const data = await response.json();
              setSelfId(data);
            } catch (error) {
              console.error("Error fetching selfId:", error);
            }
          };
          getSelfId()
    }, [selfId, selfNameProp, selfTagProp])
    
    console.log(selfId)
  return (
    <Context.Provider value={{selfId, setSelfId}}>
        {children}
    </Context.Provider>
  )
}

export default SelfIdProvider;

// Custom hook to access selfId
export const useSelfId = () => useContext(Context);