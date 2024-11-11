import { signOut } from 'next-auth/react';
import { useState } from 'react'


const Dropdown = () => {
    const [signOutClicked, setSignOutClicked] = useState(false);

    function handleSignOut(){
        setSignOutClicked(true);
    }

    signOutClicked === true ? signOut() : null

  return (
    <div className="dropdown mb-12">
      <div className="dropdown-content">
        <button>Your Profile</button>
        <button onClick = {handleSignOut}>Sign out</button>
      </div>
    </div>
  )
}

export default Dropdown