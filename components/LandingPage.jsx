import Link from 'next/link'

const LandingPage = () => {
  return (
        <div className = "landingPageIntroBox flex flex-col p-7 m-7">
            <h1 className = "head_text self-start h-100 p-3">Letcotes, the official site to message your friends!</h1>
            <p className = "desc_text self-start w-max p-3">Welcome to Letcotes, a revolutionary platform for social networking, instant messaging, and real-time communication. We empower users to connect, share, and thrive in a vibrant digital ecosystem.</p>
            <Link href = "/login" className ="self-start p-3 block mt-5 text-lg underline-offset-4 hover:underline md:inline-block md:text-sm dark:hover:text-neutral-600  dark:text-neutral-600">Get Started</Link>
            <img className = "mt-10"src = "/gridImage.png"></img>
        </div> 
  )
}

export default LandingPage