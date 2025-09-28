import { OAuth2Client } from "google-auth-library";
import userModel from '../models/user.model.js';
import jwt from "jsonwebtoken";
import {google} from 'googleapis';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

export const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    `${BACKEND_URL}/users/auth/google/callback`
)

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
