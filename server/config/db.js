import mongoose from 'mongoose';

export async function connectDatabase() {
    if (!process.env.MONGODB_URI) {
        console.error('MONGODB_URI is not set; consultation submissions are unavailable.');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB.');
    } catch (error) {
        console.error('MongoDB connection failed; consultation submissions are unavailable:', error.message);
    }
}
