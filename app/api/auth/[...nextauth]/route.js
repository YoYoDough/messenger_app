import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from "next-auth/providers/credentials";


const handler = NextAuth({
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
      //manual sign up when user enters account info into form
      CredentialsProvider({
        name: "credentials",
        credentials: {
          email: { label: "Email", type: "email"},
          password: { label: "Password", type: "text", placeholder: "Password"},
        },
        async authorize(credentials){
          try {
            // Send POST request to backend to register the user
            const res = await fetch("http://localhost:8080/api/users/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            });
      
            if (res.ok) {
              const user = await res.json(); // Get user data on successful login
              return user; // If user exists, return user object
            } else {
              console.error("Login failed");
              return null;
            }
          } catch (error) {
            console.error("Error during authorization:", error);
            return null;
          }
        }
      })
      
    ],
    session: {
      strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: 
    {
      async signIn({ user, account, profile }) {
        try {
          if (account.provider === "google") {
            // Handle Google sign-in
            const userExistsResponse = await fetch(`http://localhost:8080/api/users/exists?email=${profile.email}`);
    
            if (userExistsResponse.status === 404) {
              // Send Google user data to your backend
              const response = await fetch('http://localhost:8080/api/users', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: user.email,
                  name: user.name,
                  username: user.name,
                  image: user.image,
                }),
              });
    
              if (!response.ok) {
                throw new Error('Failed to save Google user data to backend');
              }
              if (response.ok){
                userDataResponse = await response.json();
                user.name = userDataResponse.name;
              }
            }
          } 
          // Return true if everything is successful
          return true;
    
        } catch (error) {
          console.error('Error in signIn callback:', error);
          return false;
        }
      },

      async session({ session, user }) {
        // Attach more user data to the session
        
        return session;
      },
    },
    
  });
  
  export { handler as GET, handler as POST }
