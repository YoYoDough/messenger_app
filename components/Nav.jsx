"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import Dropdown from "@components/Dropdown";
import NavButtons from "./NavButtons";
import { useSelfId } from "./SelfIdProvider";

const Nav = ({noNav}) => {
  const {data: session} = useSession();
  const [darkMode, setDarkMode] = useState(false);
  const [profileClicked, setProfileClicked] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const { selfId } = useSelfId()

  useEffect(() => {
    const getFriendRequestCount = async () => {
      if (!selfId) return; // Ensure selfId is available before making the fetch request
      const response = await fetch(`http://localhost:8080/api/friends/count/${selfId}`);
      const data = await response.json();
      setFriendRequests(data);
    };

    getFriendRequestCount(); // Call the function to get the friend requests count
  }, [selfId])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    // Apply the dark mode class to the <html> element
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  function handleProfileClick(){
    setProfileClicked(!profileClicked);
  }

  if (noNav){
    return null;
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <nav className={`navbar flex flex-col justify-content-start h-screen shadow nav ${darkMode ? "dark" : ""}`}>
        <Link href="/">
          <img src="logo.png" className="logo" alt="Logo" />
        </Link>

        {session?.user && (
          <div className = "navButtons mt-2">
            <NavButtons title = "Messages" hrefLink = "/chatPage" src = "messageIcon.png" alt = "Messages Icon"/>
            <NavButtons title = "Find Friends" hrefLink = "/findFriends" src = "friends.png" alt = "Friends Icon"/>
            <NavButtons title = "Groups" hrefLink = "/groups" src = "groupIcon.png" alt = "Groups Icon"/>
          </div>
        )}

        <div className="self-center mt-72">
          <input
            type="checkbox"
            className="checkbox"
            id="checkbox"
            onChange={toggleDarkMode}
          />
          <label htmlFor="checkbox" className="checkbox-label">
            <FontAwesomeIcon icon={faMoon} />
            <FontAwesomeIcon icon={faSun} />
            <span className="ball"></span>
          </label>
        </div>

        {!session?.user ? (
          <>
            <Link href="/login" className="signInbutton self-center mt-auto mb-20">
              <p>Sign in</p>
            </Link>
          </>
        ) :
          <>
            
            <button className = "profile-btn mt-auto mb-20 relative" onClick = {handleProfileClick}>
            <div className = "flex items-left relative p-2">
              <img className = "flex ml-4 w-20 rounded-full bg-transparent"src = {session.user.image}></img>
              <div className = "flex self-center justify-self-center absolute w-5 h-5 bg-green-400 rounded-full left-20 top-16"></div>
            </div>
            </button>
            {profileClicked && <Dropdown onClose = {handleProfileClick}/>}
          </>
        }
        
      </nav>
      
    </div>
  );
};

export default Nav;