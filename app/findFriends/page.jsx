"use client"
import { useState } from "react"


const page = () => {
    const [input, setInput] = useState(""); // Search input
    const [searchResults, setSearchResults] = useState([]); // Filtered users
    const [allUsers, setAllUsers] = useState([]); // Full list of users
    const [showDropdown, setShowDropdown] = useState(false);

    const fetchUsersFromInput = async(e) => {
      const response = await fetch("http://localhost:8080/api/users");
      const data = response.json();
      const result = data.filter((user) => {
        return (
          e &&
          user &&
          user.name &&
          user.name.toLowerCase().includes(e)
        )
      })

    }

    const handleChange = (e) =>{
        setInput(e.target.value);
    }
  return (
    <div className  = "flex flex-col p-10 m-10">
        <h1 className = "head_text">Find new people to connect with!</h1>
        <input className = "text-black w-30 h-10 mt-5 p-2"type = "text" onChange = {handleChange} placeholder = "Type in your friends correct name along with # tag">

        </input>
    </div>
  )
}

export default page