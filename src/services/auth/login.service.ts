import prisma from "../../utils/prisma.js";
import bcrypt from "bcrypt"
import  jwt  from "jsonwebtoken";

import { createRefreshToken } from "../token/refreshToken.service";

// Get our Secret key in our .env and keep it here
const JWT_SECRET = process.env.JWT_SECRET;

// Validate if the JWT exist in our .env, if not then throw an error
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured")
}

// Create the login function 
export async function loginUser(email: string, password: string) {

    // 1.Find the user: looks up their normalized email in PostgreSQL.
    const user = await prisma.user.findUnique({
    where: {
      email: email.trim().toLowerCase(),
    },
  });

    // Validate: confirm is the user exist in our database, do not return the user yet
    // return error or null if user does not exist
    if (!user) {
        throw new Error("User does not exist");
    }

    // If user exist thn compare passwords 
    // Verify the password: using bcrypt.compare() compares the submitted password against the stored hash. 
    // We never decrypt or retrieve the original password.
    const passwordMatches = await bcrypt.compare(password, user.password);

    // Validate: If passwords do not match then return null or an error message
    // Reject invalid credentials: returns null for either a nonexistent email or an incorrect password.
    if (!passwordMatches) {
        throw new Error("Password is incorrect");
    }

    // Sign a JWT: includes the user's ID and sets the token to expire after one hour.
    const accessToken = jwt.sign(
        { id: user.id },
        JWT_SECRET as string ,
        { expiresIn: "15m" }
    );

    const refreshSession = await createRefreshToken(user.id)
    // Return safe user data: never returns the stored password hash.
    return {
      accessToken,
        user:{
            id: user?.id,
            email: user?.email,
            createdAt: user?.createdAt
        },
        refreshToken: refreshSession.token,
    }

}