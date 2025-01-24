import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: Record<string, string> | undefined) {
        if (!credentials) return null;
        
        const user = { id: 1, email: 'user@example.com', password: 'password123' };
        if (credentials.email === user.email && credentials.password === user.password) {
          return user;
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
