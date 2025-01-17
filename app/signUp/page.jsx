"use client"
import { useState, useEffect } from 'react'
import { useSession, getProviders, signIn, signOut, authorize } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const page = () => {
    const {data: session} = useSession();
    const [providers, setProviders] = useState(null);
    const router = useRouter();

    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
        image: "defaultUserImg.png"
    })
    console.log(userData);

    console.log(session);
    

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
      
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          // Check if the user exists
          const checkUserRes = await fetch(`http://localhost:8080/api/users/exists?email=${userData.email}`);
          
          if (checkUserRes.status === 404) {
              // If the user doesn't exist, proceed to create the user
              const res = await fetch("http://localhost:8080/api/users/add", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(userData),
              });
              console.log(res)

              console.log("User created successfully:", await res.json());
          } else if (checkUserRes.ok) {
            alert("User with email already exists!")
            console.log("User already exists, skipping registration.");
          } else {
              console.error("Unexpected error during user existence check:", checkUserRes.status);
              return;
          }
  
          // Perform sign-in after checking or creating the user
          // This creates the session
          const { email, password, name } = userData;
          const signInRes = await signIn("credentials", {
              name,
              email,
              password,
              redirect: false,
          });
  
          if (signInRes.error) {
              console.error("Failed to sign in:", signInRes.error);
          } else {
              console.log("User signed in successfully:", signInRes);
              router.push("/");
          }
      } catch (error) {
          console.error("Error during handleSubmit:", error);
      }
      };

      /*const handleLogout = async () => {
        await signOut({ redirect: false });
        console.log("User logged out.");
      };
      handleLogout()*/
        

  return (
    <div className = "w-full flex flex-col justify-center items-center">
        <div className = "flex flex-col shadow p-10 w-200">
        <h1 className = "font-poppins font-bold text-lg">Create your Account</h1>
        
        <form className = "flex flex-col justify-center items-center m-4 p-10" onSubmit = {handleSubmit}>
          
            <input className = "w-full border border-gray-300 text-black rounded-md p-2 m-2" type = "text" name = "name" value = {userData.name} onChange = {handleChange} placeholder="Name" required>
            
            </input>

            <input className = "w-full border border-gray-300 rounded-md p-2 m-2" type = "email" name = "email" value = {userData.email} onChange = {handleChange} placeholder="Email Address" required>

            </input>

            <input className = "w-full border border-gray-300 rounded-md p-2 m-2" type = "text" name = "password" value = {userData.password} onChange = {handleChange} placeholder="Password"></input>

            <button className = "w-full h-10 bg-blue-400 rounded m-2 p-2" type = "submit">Create Account</button>
        </form>

        <div className = "flex items-center my-4">
            <div className = "w-full h-px bg-gray-300" ></div>
            <p className = "px-2">Or</p>
            <div className = "w-full h-px bg-gray-300"></div>
        </div>

        {providers && (
            Object.values(providers).filter((provider)=> provider.id !== "credentials").map((provider) => (
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