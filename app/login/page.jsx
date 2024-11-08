import Nav from '@components/Nav'

const page = () => {
  const noNav = true;
  console.log(noNav)
  return (
    <div>
        <Nav noNav = {noNav}></Nav>
    </div>
  )
}

export default page