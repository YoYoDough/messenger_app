"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";

const Nav = ({noNav}) => {
  const [darkMode, setDarkMode] = useState(false);

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

  return (
    <div className={darkMode ? "dark" : ""}>
      <nav className={`flex flex-col justify-content-start h-screen shadow nav ${darkMode ? "dark" : ""}`}>
        <Link href="/">
          <img src="logo.png" className="logo" alt="Logo" />
        </Link>

        <div className="self-center mt-96">
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
          <img>
          
          </img>
        }
        
      </nav>
    </div>
  );
};

export default Nav;