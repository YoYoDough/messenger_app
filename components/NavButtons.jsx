import Link from 'next/link';

const NavButtons = ({title, hrefLink, src, alt}) => {
  return (
    <button title = {title} className = "flex self-center w-20 justify-self-center hover:bg-gray-400  rounded-full">
      <Link className = "self-center p-5" href = {hrefLink}>
          <img className = "flex self-center justify-self-center w-full bg-transparent" src = {src} alt = {alt}></img>
      </Link>
    </button>
  )
}

export default NavButtons