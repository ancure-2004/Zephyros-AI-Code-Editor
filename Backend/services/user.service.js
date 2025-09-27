import { OAuth2Client } from "google-auth-library";
import userModel from '../models/user.model.js';
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const createUser = async ({
    name: {
        firstName,
        lastName,
    },
    email, 
    password,
}) => {

    if(!email || !password) {
        throw new Error('Email and password are required');
    }

    if(!firstName || !lastName){
        throw new Error("Full Name is required");
    }

    const existing = await userModel.findOne({ email }).lean();
    if (existing) {
        throw new Error('A user with this email already exists');
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userModel.create({
        name: {
            firstName,
            lastName,
        },
        email,
        password: hashedPassword,
    });

    return user;
};

export const googleLoginService = async (idToken) => {
  // Verify Google token
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { sub: googleId, email, name } = payload; // name is full name

  // Split full name into firstName / lastName
  const nameParts = name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ") || ""; // handles single-name users

  // Find or create user
  let user = await userModel.findOne({ email });
  if (!user) {
    user = await userModel.create({
      googleId, // optional, for reference
      email,
      name: { firstName, lastName },
    });
  }

  console.log(user);

  // Create JWT
  const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15d" });

  return { user, jwtToken };
};

export const getAllUsers = async ({ userId }) => {
    try {
        const users = await userModel.find({
            _id: { $ne: userId }
        }); // Exclude password field
        return users;
        
    } catch (error) {
        throw error;
    }
};
