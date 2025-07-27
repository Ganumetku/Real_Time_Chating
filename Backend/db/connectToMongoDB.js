import mongoose from 'mongoose';

const connectToMongoDB = async () => {
    try {
        console.log("🔍 MONGO_URI from .env:", process.env.MONGO_URI); // debug line
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ Successfully Connected to Database");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1);
    }
};

export default connectToMongoDB;
