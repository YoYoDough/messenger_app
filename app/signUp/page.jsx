"use client"
import { useState, useEffect } from 'react'
import { useSession, getProviders } from 'next-auth/react';
const page = () => {
    const {data: session} = useSession();
    const [providers, setProviders] = useState(null);

    const [userData, setUserData] = useState({
        username: "",
        email: "",
        password: "",
        img: "defaultUserImg.png"
    })
    console.log(userData);

    useEffect(() => {
        const setUpProviders = async() => {
          const response = await getProviders();
          setProviders(response);
        };
        setUpProviders();
      }, []);

      const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        })
      }

      
        const handleSubmit = async () => {
          const res = await fetch("http://localhost:8080/api/signUp", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          });
      
          if (!res.ok) {
            console.error("Failed to sign up");
          }
        };

  return (
    <div className = "w-full flex flex-col justify-center items-center">
        <div className = "flex flex-col shadow p-10 w-200">
        <h1 className = "font-poppins font-bold text-lg">Create your Account</h1>
        
        <form className = "flex flex-col justify-center items-center m-4 p-10" onSubmit = {handleSubmit}>
            <input className = "w-full border border-gray-300 text-black rounded-md p-2 m-2" type = "text" name = "username" value = {userData.username} onChange = {handleChange} placeholder="Username" required>
            
            </input>

            <input className = "w-full border border-gray-300 rounded-md p-2 m-2" type = "email" name = "email" value = {userData.email} onChange = {handleChange} placeholder="Email Address" required>

            </input>

            <input className = "w-full border border-gray-300 rounded-md p-2 m-2" type = "password" name = "password" value = {userData.password} onChange = {handleChange} placeholder="Password"></input>

            <button className = "w-full h-10 bg-blue-400 rounded m-2 p-2" type = "submit">Create Account</button>
        </form>

        <div className = "flex items-center my-4">
            <div className = "w-full h-px bg-gray-300" ></div>
            <p className = "px-2">Or</p>
            <div className = "w-full h-px bg-gray-300"></div>
        </div>

        {providers && (
            Object.values(providers).map((provider) => (
                <button type = "button" key = {provider.name} onClick = {() => signIn(provider.id)}className = "w-full flex justify-center bg-gray-300 text-black rounded mt-3 p-2">
                    <span className = "flex items-center">
                        <p className = "text-lg">Sign in with</p>
                        <img className = "ml-2 w-8" src = "/googleLogo.png"></img>
                    </span>
                </button>
            ))
        )}
        
        </div>
    </div>
  )
}

export default page