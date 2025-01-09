"use client"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react";

import Link from "next/link";


const page = () => {
    const { data: session } = useSession();
    console.log(session);
    const [input, setInput] = useState(""); // Search input
    const [searchResults, setSearchResults] = useState([]); // Filtered users
    const selfNameProp = session?.user.name.split("#")[0];
    const selfTagProp = "#" + session?.user.name.split("#")[1];
    const [selfId, setSelfId] = useState(null);
    const [addedFriends, setAddedFriends] = useState([]);
    const [isDisabled, setIsDisabled] = useState(false);
    const [allUsers, setAllUsers] = useState([]); // Full list of users
    const [showDropdown, setShowDropdown] = useState(false);

    console.log(searchResults);

    let userId;
    console.log(userId);

    useEffect(() => {
        const getSelfId = async () => {
          if (!selfNameProp || !selfTagProp) {
            console.warn("Session data is missing, cannot fetch selfId.");
            return;
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
    
        getSelfId();
      }, [selfNameProp, selfTagProp]);

      console.log(selfId)
    

    const handleFriendAdd = async(user) => {
      const response = await fetch(`http://localhost:8080/api/friends/friendrequest?email=${session?.user.email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          friend_id: user.id,
          status: "pending",
        })
      })
      setAddedFriends((prev)=> [...prev, user.id])
      setIsDisabled(true);

      console.log(response);
    }

    const fetchUsersFromInput = async(input, userId) => {
        if (!input.trim() || input.length === 0){
          setSearchResults([]);
          return;
        }
        console.log(input);
        const response = await fetch("http://localhost:8080/api/users/input");
        console.log(response);
        const data = await response.json();
        console.log(data);
        
    
        const result = data.filter((user) => {
          return (
            user.name !== session?.user.name &&
            user.name &&
            user.name.toLowerCase().includes(input.toLowerCase())
          );
        });
        setSearchResults(result);
    }

    const handleChange = (e) =>{
        fetchUsersFromInput(e.target.value)
        setInput(e.target.value)
    }
    
    useEffect(() => {
      const fetchFriends = async () => {
          if (!session?.user.email) return;
          try {
              const email = session.user.email;
              const response = await fetch(`http://localhost:8080/api/friends/requested?email=${email}`);
              if (!response.ok) throw new Error("Failed to fetch friends");
              const friends = await response.json();
              setAddedFriends(friends);
          } catch (error) {
              console.error("Error fetching friends:", error);
          }
      };
  
      fetchFriends();
  }, [session?.user.email]);
    console.log(addedFriends)

    const fetchUserHasConvo = async(selfId, userId) => {
      const response = await fetch("http://localhost:8080/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user1Id: selfId, // Replace with your user ID
          user2Id: userId, // Replace with the recipient's user ID
        }),
      });
  
      if (!response.ok) {
        console.error("Failed to create conversation");
        return;
      }
      console.log(response.ok);
      const conversation = await response.json();
      return conversation;
    }


  return (
    <div className  = "flex flex-col p-10 m-10">

        <h1 className = "head_text">Find new people to connect with!</h1>
        <input className = "text-black w-30 h-10 mt-5 p-2"type = "text" onChange = {handleChange} placeholder = "Type in the user's correct name along with # tag">

        </input>
        <div className="mt-2 max-h-72 bg-white border rounded shadow">
          {searchResults.map((user) => (
            <div key={user.id} className="flex justify-between items-center text-black p-2 hover:bg-gray-200">
              <div className = "flex items-center">
                <img className = "w-10 mr-2 rounded-full"src = {user.image}></img>
                <p>{user.name}</p>
              </div>
              
              <div className = "flex justify-center items-center">
                <button title = {isDisabled === true || addedFriends.includes(user.id) ? "Friend added": "Add as a friend"} onClick = {() => handleFriendAdd(user)} className = "flex w-10 align-self-center hover:bg-gray-400 rounded-full mr-1" disabled = {addedFriends.includes(user.id) || isDisabled}><img src = "addFriend.png" alt = "Add friend image"></img></button>
                <Link href = {{pathname: "/chatPage", query: {conversation: fetchUserHasConvo(selfId, user.id), userId: user.id, userName: user.name, userImage: user.image}}}><button title = "Send message" onClick = {() => handleChatClick(user)} className = "flex w-10 align-self-center hover:bg-gray-400 rounded-full p-1"><img src = "sendMessage.png" alt = "Send message image"></img></button></Link>
              </div>
            </div>
          ))}
        </div>
    </div>
  )
}

export default page