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

    const handleFriendAdd = async() => {

    }

    const handleChatClick = () => {

    }

    const fetchUsersFromInput = async(input) => {
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
        <div className="mt-2 bg-white border rounded shadow">
          {searchResults.map((user) => (
            <div key={user.id} className="flex justify-between items-center text-black p-2 hover:bg-gray-200">
              <p>{user.name}</p>
              <div className = "flex justify-center items-center">
                <button onClick = {handleFriendAdd} className = "flex w-10 align-self-center hover:bg-gray-400 rounded-full mr-1"><img src = "addFriend.png"></img></button>
                <button onClick = {handleChatClick} className = "flex w-10 align-self-center hover:bg-gray-400 rounded-full p-1"><img src = "sendMessage.png"></img></button>
              </div>
            </div>
          ))}
        </div>
    </div>
  )
}

export default page