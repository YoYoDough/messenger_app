"use client"
import { useState } from "react"


const page = () => {
    const [input, setInput] = useState("");

    const handleChange = (e) =>{
        setInput(e.target.value);
    }
  return (
    <div className  = "flex flex-col p-10 m-10">
        <h1 className = "head_text">Find new people to connect with!</h1>
        <input className = "w-30 h-10 mt-5 p-2"type = "text" onChange = {handleChange} placeholder = "Type in your friends correct name along with # tag">

        </input>
    </div>
  )
}

export default page