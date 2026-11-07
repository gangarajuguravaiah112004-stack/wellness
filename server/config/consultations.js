import mongoose from 'mongoose';

export const programs = ['Weight Loss', 'Weight Gain', 'Digestion Health', "Women's Health"];

const consultationSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, required: true, trim: true, maxlength: 24 },
    email: { type: String, trim: true, lowercase: true, maxlength: 160 },
    program: { type: String, required: true, enum: programs },
    preferredTime: { type: String, maxlength: 40 },
    notes: { type: String, maxlength: 500 },
    createdAt: { type: Date, default: Date.now },
});

export const Consultation = mongoose.models.Consultation
    || mongoose.model('Consultation', consultationSchema);

export function validateConsultation(body) {
    const { name, phone, email, program, preferredTime, notes } = body || {};
    const normalizedName = typeof name === 'string' ? name.trim() : '';
    const normalizedPhone = typeof phone === 'string' ? phone.replace(/[\s()-]/g, '') : '';
    const normalizedEmail = typeof email === 'string' ? email.trim() : '';
    const normalizedPreferredTime = typeof preferredTime === 'string' ? preferredTime.trim() : '';
    const normalizedNotes = typeof notes === 'string' ? notes.trim() : '';

    if (!normalizedName || normalizedName.length > 100 || !/^\+?\d{8,15}$/.test(normalizedPhone)) {
        return { error: 'Please provide your name and a valid phone number.' };
    }
    if (normalizedEmail.length > 160 || (normalizedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail))) {
        return { error: 'Please provide a valid email address.' };
    }
    if (!programs.includes(program)) {
        return { error: 'Please select one of the listed wellness programs.' };
    }
    if (normalizedPreferredTime.length > 40) {
        return { error: 'Please keep your preferred date and time under 40 characters.' };
    }
    if (normalizedNotes.length > 500) {
        return { error: 'Please keep your note under 500 characters.' };
    }

    return {
        consultation: {
            name: normalizedName,
            phone: normalizedPhone,
            email: normalizedEmail,
            program,
            preferredTime: normalizedPreferredTime,
            notes: normalizedNotes,
        },
    };
}
