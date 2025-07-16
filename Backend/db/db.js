import mongoose from 'mongoose';

function connectDB() {
    mongoose.connect(process.env.MONGO_URI).then(() =>{
        console.log("MongoDB connected Successfully");
    }).catch((err) => {
        console.log("MongoDB connection failed");
        console.log(err);
    })
}

export default connectDB;