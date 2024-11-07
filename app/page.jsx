import Image from "next/image";
import LandingPage from '@components/LandingPage'

export default function Home() {
  return (
    <div className = "flex flex-col w-full">
        <LandingPage></LandingPage>
    </div>
  );
}
