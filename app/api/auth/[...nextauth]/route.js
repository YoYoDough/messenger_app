import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
          const userExistsResponse = await fetch(`http://localhost:8080/api/users/exists?email=${profile.email}`);
  
          if (userExistsResponse.status === 404)
          {
            // Send user data to your backend
            const response = await fetch('http://localhost:8080/api/users', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                // Optionally include an API key or token for backend authentication
              },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                image: user.image,
              }),
            });
            if (!response.ok) {
              throw new Error('Failed to save user data to backend');
            }
          }
          
          return true;
        } catch (error) {
          console.error('Error in signIn callback:', error);
          return false;
        }
      },
    },
  });
  
  export { handler as GET, handler as POST }
