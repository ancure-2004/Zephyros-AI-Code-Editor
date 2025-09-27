import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({

    name: {
        firstName : {
            type: String,
            required: true,
        },
        lastName : {
            type: String,
            required: true,
        }
    },  

    email : {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: [5, 'Email must be at least 5 characters long'],
        maxLength: [50, 'Email must be at most 50 characters long'],
    },

    password: {
        type: String,
        select: false,
    }
})

userSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
}

userSchema.methods.isValidPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAuthToken = function() {
    return jwt.sign({ id: this._id, email: this.email }, process.env.JWT_SECRET, {
        expiresIn: '24h'
    });
}

const User = mongoose.model('user', userSchema);
export default User;