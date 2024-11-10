"use client"
import Link from "next/link"
import { useState, useEffect } from 'react'
import { useSession, signIn, signOut, getProviders } from "next-auth/react"

const LoginCard = () => {
    const {data: session} = useSession();
    const [providers, setProviders] = useState(null);

    const [userData, setUserData] = useState({
        email: "",
        password: "",
        img: "defaultUserImg.png"
    })

    useEffect(() => {
        const setUpProviders = async () => {
          const response = await getProviders();
          setProviders(response);
        };
        setUpProviders();
      }, []);

      console.log(providers);
  return (
    <div className = "flex flex-col shadow p-10 w-200">
        <h1 className = "font-poppins font-bold text-lg">Login to your Account</h1>
        <span className = "flex items-center text-xs">
            <p className = "font-extralight mr-1">Dont have one? Sign into one here: </p>
            <Link className = "text-blue-500"href = "/signUp">Create Account</Link>
        </span>
        
        <form className = "flex flex-col justify-center items-center m-4 p-10">
            <input className = "w-full border border-gray-300 rounded-md p-2 m-2" type = "email" placeholder="Email Address">

            </input>

            <input className = "w-full border border-gray-300 rounded-md p-2 m-2" type = "password" placeholder="Password"></input>

            <button className = "w-full h-10 bg-blue-400 rounded m-2 p-2" type = "submit">Login with email</button>
        </form>

        <div className = "flex items-center my-4">
            <div className = "w-full h-px bg-gray-300" ></div>
            <p className = "px-2 text-black">Or</p>
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
  )
}

export default LoginCard