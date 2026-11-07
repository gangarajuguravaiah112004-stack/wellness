import mongoose from 'mongoose';

let connectionPromise;

export function isDatabaseConnected() {
    return mongoose.connection.readyState === 1;
}

export async function connectDatabase() {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not set.');
    }

    if (isDatabaseConnected()) return;

    if (!connectionPromise) {
        connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        }).then(() => {
            console.log('Connected to MongoDB.');
        }).catch((error) => {
            connectionPromise = undefined;
            throw error;
        });
    }

    await connectionPromise;
}
