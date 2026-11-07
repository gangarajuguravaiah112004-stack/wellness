import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import { connectDatabase } from './config/db.js';

const app = express();
const port = process.env.PORT || 8000;
const programs = ['Weight Loss', 'Weight Gain', 'Digestion Health', "Women's Health"];
const consultationSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, required: true, trim: true, maxlength: 24 },
    email: { type: String, trim: true, lowercase: true, maxlength: 160 },
    program: { type: String, required: true, enum: programs },
    preferredTime: { type: String, maxlength: 40 },
    notes: { type: String, maxlength: 500 },
    createdAt: { type: Date, default: Date.now },
});
const Consultation = mongoose.model('Consultation', consultationSchema);

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
        const { name, phone, email, program, preferredTime, notes } = request.body || {};
        const normalizedName = typeof name === 'string' ? name.trim() : '';
        const normalizedPhone = typeof phone === 'string' ? phone.replace(/[\s()-]/g, '') : '';
        const normalizedEmail = typeof email === 'string' ? email.trim() : '';
        const normalizedPreferredTime = typeof preferredTime === 'string' ? preferredTime.trim() : '';
        const normalizedNotes = typeof notes === 'string' ? notes.trim() : '';

        if (!normalizedName || normalizedName.length > 100 || !/^\+?\d{8,15}$/.test(normalizedPhone)) {
            return response.status(400).json({ message: 'Please provide your name and a valid phone number.' });
        }
        if (normalizedEmail.length > 160 || (normalizedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail))) {
            return response.status(400).json({ message: 'Please provide a valid email address.' });
        }
        if (!programs.includes(program)) {
            return response.status(400).json({ message: 'Please select one of the listed wellness programs.' });
        }
        if (normalizedPreferredTime.length > 40) {
            return response.status(400).json({ message: 'Please keep your preferred date and time under 40 characters.' });
        }
        if (normalizedNotes.length > 500) {
            return response.status(400).json({ message: 'Please keep your note under 500 characters.' });
        }
        if (mongoose.connection.readyState !== 1) {
            return response.status(503).json({ message: 'Consultation requests are temporarily unavailable because the database is not connected.' });
        }

        const consultation = {
            name: normalizedName,
            phone: normalizedPhone,
            email: normalizedEmail,
            program,
            preferredTime: normalizedPreferredTime,
            notes: normalizedNotes,
        };
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
    await connectDatabase();
    app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
}

start();
