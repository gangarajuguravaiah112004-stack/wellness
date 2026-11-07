import { connectDatabase } from '../../server/config/db.js';
import { Consultation, validateConsultation } from '../../server/config/consultations.js';

const jsonResponse = (body, status = 200) => new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
});

export default async function handler(request) {
    const { pathname } = new URL(request.url);

    if (pathname === '/api/health' && request.method === 'GET') {
        try {
            await connectDatabase();
            return jsonResponse({ status: 'ok', database: 'mongodb' });
        } catch (databaseError) {
            console.error('MongoDB health check failed:', databaseError.message);
            return jsonResponse({ status: 'unavailable', database: 'unavailable' }, 503);
        }
    }

    if (pathname !== '/api/consultations') {
        return jsonResponse({ message: 'Not found.' }, 404);
    }
    if (request.method !== 'POST') {
        return jsonResponse({ message: 'Method not allowed.' }, 405);
    }

    let body;
    try {
        const text = await request.text();
        if (new TextEncoder().encode(text).byteLength > 1024 * 1024) {
            return jsonResponse({ message: 'The request is too large.' }, 413);
        }
        body = JSON.parse(text);
    } catch {
        return jsonResponse({ message: 'Please send a valid request.' }, 400);
    }

    const { consultation, error } = validateConsultation(body);
    if (error) return jsonResponse({ message: error }, 400);

    try {
        await connectDatabase();
        const savedRequest = await Consultation.create(consultation);
        return jsonResponse({ consultationId: String(savedRequest._id) }, 201);
    } catch (databaseError) {
        console.error('Unable to save consultation:', databaseError.message);
        return jsonResponse({
            message: 'Consultation requests are temporarily unavailable because the database is not connected.',
        }, 503);
    }
}

export const config = {
    path: '/api/*',
};
