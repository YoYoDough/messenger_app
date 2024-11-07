import Link from 'next/link';

const NavButtons = ({hrefLink, src}) => {
  return (
    <Link href = {hrefLink}>
        <img src = {src}></img>
    </Link>
  )
}

export default NavButtons