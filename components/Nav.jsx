"user client"
import Link from 'next/link';
import {useSession} from 'next-auth/react'
const Nav = () => {
    
  return (
    
    <nav className = "flex flex-col justify-content-start h-screen shadow">
        <Link href = "/">
            <img src = "logo.png" className = "logo"></img>
        </Link>

        <div className = "self-center mt-96">
            <input type="checkbox" className="checkbox" id="checkbox"/>
            <label for="checkbox" className="checkbox-label">
                <i className="fas fa-moon"></i>
                <i className="fas fa-sun"></i>
                <span className="ball"></span>
            </label>
        </div>
        
        <Link href = "/signIn" className = "signInbutton self-center mt-auto mb-20">
            <p>Sign in</p>
        </Link>
    </nav>
  )
}

export default Nav