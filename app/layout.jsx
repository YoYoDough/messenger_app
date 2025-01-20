"use client"
import "@styles/globals.css";
import Provider from "@components/Provider"
import Nav from "@components/Nav"
import { usePathname } from "next/navigation";
import SelfIdProvider from "@components/SelfIdProvider";
import SocketProvider from "@components/SocketProvider";

export const RootLayout = ({ children }) => {
  const pathname = usePathname();
  const hidenav = pathname === "/login" || pathname === "/signUp"

  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Raleway:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"/>
      </head>
      <body>
        <Provider>
          <SelfIdProvider> 
            <SocketProvider>
              <main className="flex h-screen">
                {!hidenav && <Nav />}
                {children}
              </main>
            </SocketProvider>
          </SelfIdProvider>
        </Provider>
      </body>
    </html>
  );
}

export default RootLayout
