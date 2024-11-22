"use client"
import { useState } from "react"


const page = () => {
    const [input, setInput] = useState(""); // Search input
    const [searchResults, setSearchResults] = useState([]); // Filtered users
    const [allUsers, setAllUsers] = useState([]); // Full list of users
    const [showDropdown, setShowDropdown] = useState(false);
    console.log(searchResults);

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
            user.name &&
            user.name.toLowerCase().includes(input.toLowerCase())
          );
        });
        setSearchResults(result);
    }

    const handleChange = (e) =>{
        setInput(e.target.value);
        fetchUsersFromInput(input)
    }
  return (
    <div className  = "flex flex-col p-10 m-10">
        <h1 className = "head_text">Find new people to connect with!</h1>
        <input className = "text-black w-30 h-10 mt-5 p-2"type = "text" onChange = {handleChange} placeholder = "Type in your friends correct name along with # tag">

        </input>
        <div className="mt-2 bg-white border rounded shadow">
          {searchResults.map((user) => (
            <div key={user.id} className="p-2 hover:bg-gray-200">
              {user.name}
            </div>
          ))}
        </div>
    </div>
  )
}

export default page