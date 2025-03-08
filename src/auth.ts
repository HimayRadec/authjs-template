
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import { schema } from "@/lib/schemaValidation"
import client from "@/lib/db"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
   adapter: MongoDBAdapter(client),
   providers: [
      Google,
      Credentials({
         // You can specify which fields should be submitted, by adding keys to the `credentials` object.
         // e.g. domain, username, password, 2FA token, etc.
         credentials: {
            email: {},
            password: {},
         },
         authorize: async (credentials) => {
            let user = null
            const validatedCredentials = schema.parse(credentials);

            // logic to salt and hash password
            // const pwHash = saltAndHashPassword(validatedCredentials.password)

            // logic to verify if the user exists
            user = await getUserFromDb(validatedCredentials.email, validatedCredentials.password)

            if (!user) {
               // No user found, so this is their first attempt to login
               // Optionally, this is also the place you could do a user registration
               throw new Error("Invalid credentials.")
            }

            // return user object with their profile data
            return user
         },
      }),
   ],
});



async function getUserFromDb(email: string, password: string) {
   const userList = [
      {
         email: "admin@gmainl.com",
         password: "admin",
      }
   ]


   const user = userList.find((user) => user.email === email && user.password === password)
   return user || null
}