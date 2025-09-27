import userModel from '../models/user.model.js';

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
