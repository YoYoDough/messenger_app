"use client"
import { useState } from "react"
import { useSession } from "next-auth/react";


const page = () => {
    const { data: session } = useSession();
    console.log(session);
    const [input, setInput] = useState(""); // Search input
    const [searchResults, setSearchResults] = useState([]); // Filtered users
    const [allUsers, setAllUsers] = useState([]); // Full list of users
    const [showDropdown, setShowDropdown] = useState(false);
    const [showChatComponent, setShowChatComponent] = useState();

    console.log(searchResults);

    let userId;
    console.log(userId);

    const getUsersId = async(userId) => {
      //get user id from session email
    }

    const handleFriendAdd = async(user, userId) => {
      const response = await fetch("http://localhost:8080/api/friends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: {
          user_id: userId,
          friend_id: user.id,
          status: "pending",
        }
      })
    }

    const handleChatClick = () => {

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

        data.map((user)=> {
          user.email === session?.user.email ? userId = user.id: null;
        })
        
    
        const result = data.filter((user) => {
          return (
            user.email !== session?.user.email &&
            user.name &&
            user.name.toLowerCase().includes(input.toLowerCase())
          );
        });
        setSearchResults(result);
    }

    const handleChange = (e) =>{
        fetchUsersFromInput(e.target.value)
        setInput(e.target.value);
        
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
                <button title = "Add as a friend" onClick = {() => handleFriendAdd(user)} className = "flex w-10 align-self-center hover:bg-gray-400 rounded-full mr-1"><img src = "addFriend.png" alt = "Add friend image"></img></button>
                <button title = "Send message" onClick = {handleChatClick} className = "flex w-10 align-self-center hover:bg-gray-400 rounded-full p-1"><img src = "sendMessage.png" alt = "Send message image"></img></button>
              </div>
            </div>
          ))}
        </div>
    </div>
  )
}

export default page