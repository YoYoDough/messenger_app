"use client"
import { useEffect, useState, useContext } from "react"
import { useSession } from "next-auth/react";
import { useSelfId } from '@components/SelfIdProvider'
import Link from "next/link";
import { Context } from "@app/layout";


const page = () => {
    const { data: session } = useSession();
    console.log(session);
    const [searchResults, setSearchResults] = useState([]); // Filtered users
    const {selfId } = useSelfId();
    const [addedFriends, setAddedFriends] = useState([]);
    const [isDisabled, setIsDisabled] = useState(false);

    console.log(searchResults);

    let userId;
    console.log(userId);

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
                <Link href = {{pathname: "/chatPage", query: {userId: user.id, userName: user.name, userImage: user.image}}}><button title = "Send message" className = "flex w-10 align-self-center hover:bg-gray-400 rounded-full p-1"><img src = "sendMessage.png" alt = "Send message image"></img></button></Link>
              </div>
            </div>
          ))}
        </div>
    </div>
  )
}

export default page