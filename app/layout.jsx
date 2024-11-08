import "@styles/globals.css";
import Provider from "@components/Provider"
import Nav from "@components/Nav"

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export const RootLayout = ({ children }) => {
  
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"/>
      </head>
      <body>
        <Provider>

          <main className = "flex h-screen">
            <Nav />
            {children}
          </main>
          
        </Provider>
      </body>
    </html>
  );
}

export default RootLayout
