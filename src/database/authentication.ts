import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";

const uri = "your_mongodb_connection_string"; // Replace with your connection string
const client = new MongoClient(uri);
const databaseName = "AUTHJS"; // Replace with your database name

/**
 * Fetches a user from the database by email and verifies the password.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's plain-text password.
 * @returns {Promise<{ [key: string]: any } | null>} - The user object if authentication is successful, otherwise null.
 */
export async function getUserFromDb(email: string, password: string): Promise<{ [key: string]: any } | null> {
   try {
      await client.connect();
      const database = client.db(databaseName);
      const usersCollection = database.collection("users"); // Replace with your collection name

      // Find the user by email
      const user = await usersCollection.findOne({ email });
      if (!user) {
         console.log("User not found");
         return null;
      }

      // Compare the hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
         console.log("Invalid password");
         return null;
      }

      return user.email;

   }
   catch (error) {
      console.error("Error fetching user from database:", error);
      return null;
   }
   finally {
      await client.close();
   }
}
