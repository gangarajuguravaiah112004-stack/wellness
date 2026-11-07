import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import { connectDatabase } from './config/db.js';
import { Consultation, validateConsultation } from './config/consultations.js';

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_request, response) => {
    response.json({
        status: 'ok',
        database: mongoose.connection.readyState === 1 ? 'mongodb' : 'unavailable',
    });
});

app.post('/api/consultations', async (request, response, next) => {
    try {
        const { consultation, error } = validateConsultation(request.body);
        if (error) return response.status(400).json({ message: error });

        if (mongoose.connection.readyState !== 1) {
            try {
                await connectDatabase();
            } catch (databaseError) {
                console.error('MongoDB is unavailable:', databaseError.message);
                return response.status(503).json({ message: 'Consultation requests are temporarily unavailable because the database is not connected.' });
            }
        }

        const savedRequest = await Consultation.create(consultation);
        response.status(201).json({ consultationId: String(savedRequest._id) });
    } catch (error) {
        next(error);
    }
});

app.use((error, _request, response, _next) => {
    const status = Number.isInteger(error.status) && error.status >= 400 && error.status < 500
        ? error.status
        : 500;
    if (status === 500) console.error(error);
    const message = status === 400
        ? 'Please send a valid request.'
        : status === 413
            ? 'The request is too large.'
            : 'Something went wrong. Please try again.';
    response.status(status).json({ message });
});

async function start() {
    try {
        await connectDatabase();
    } catch (error) {
        console.error('MongoDB connection failed; consultation submissions are unavailable:', error.message);
    }
    app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
}

start();
