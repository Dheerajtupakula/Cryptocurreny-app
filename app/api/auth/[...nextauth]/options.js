import UserData from "@/model/UserSchema";
import ConnectDB from "@/utils/Database";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          await ConnectDB();

          const user = await UserData.findOne({ email: credentials.email });

          if (!user) {
            console.log("No user found with the email:", credentials.email);
            return null;
          }

          const isValidPassword = bcrypt.compareSync(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            console.log("Invalid password for user:", credentials.email);
            return null;
          }

          // Returning the user object (ensure only safe data is included)
          return { id: user._id, email: user.email };
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
