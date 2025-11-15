import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react'

const Dropdown = () => {
    const [signOutClicked, setSignOutClicked] = useState(false);
    const {data: session} = useSession()

    function handleSignOut(){
        setSignOutClicked(true);
    }

    signOutClicked === true ? signOut({ callbackUrl: "/" }) : null

  return (
    <div className="dropdown mb-12">
      <div className="dropdown-content">
        <p>{session.user?.name}</p>
        <Link href = "/profile">
          <button>Your Profile</button>
        </Link>
        <button onClick = {handleSignOut}>Sign out</button>
      </div>
    </div>
  )
}

export default Dropdown