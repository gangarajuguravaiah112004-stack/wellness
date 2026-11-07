# Hansika Sathish Wellness Center

A React wellness-center website with four program areas and a free assessment request form. Consultation requests are stored in MongoDB when `MONGODB_URI` is configured. The API reports a database error and does not accept submissions when MongoDB is unavailable.

## Run locally

1. Install Node.js 18 or newer.
2. From the project root, run `npm install`, `npm --prefix client install`, and `npm --prefix server install`.
3. Start MongoDB locally, then copy `.env.example` to `server/.env`. The default URI (`mongodb://127.0.0.1:27017/wellness`) uses the local `wellness` database, which MongoDB creates when the first consultation is saved. Change `MONGODB_URI` to use another MongoDB deployment. MongoDB must be running to accept consultation requests.
4. Run `npm run dev`. The website is at `http://localhost:5173` and the API is at `http://localhost:8000`.

## API

- `GET /api/health` reports whether the API is using MongoDB or demo mode.
- `POST /api/consultations` validates contact details and one of the four program choices, then stores the assessment request.

The requested date and time are preferences only; the center must contact the visitor to confirm an appointment. The form does not provide medical advice or treatment.
