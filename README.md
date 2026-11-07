# Hansika Sathish Wellness Center

A React wellness-center website with four program areas and a free assessment request form. Consultation requests are stored in MongoDB when `MONGODB_URI` is configured. The API reports a database error and does not accept submissions when MongoDB is unavailable.

## Run locally

1. Install Node.js 18 or newer.
2. From the project root, run `npm install`, `npm --prefix client install`, and `npm --prefix server install`.
3. Start MongoDB locally, then copy `.env.example` to `server/.env`. The default URI (`mongodb://127.0.0.1:27017/wellness`) uses the local `wellness` database, which MongoDB creates when the first consultation is saved. Change `MONGODB_URI` to use another MongoDB deployment. MongoDB must be running to accept consultation requests.
4. Run `npm run dev`. The website is at `http://localhost:5173` and the API is at `http://localhost:8000`.

## API

- `GET /api/health` reports whether the API is connected to MongoDB.
- `POST /api/consultations` validates contact details and one of the four program choices, then stores the assessment request.

The requested date and time are preferences only; the center must contact the visitor to confirm an appointment. The form does not provide medical advice or treatment.

## Deploy to Netlify

The root `netlify.toml` configures Netlify to build the Vite client and deploy the API as a serverless function. The existing Express server remains available for local development.

1. Use a hosted MongoDB deployment such as MongoDB Atlas. A local `127.0.0.1` database is not reachable by Netlify.
2. In Netlify, choose **Add new project** → **Import an existing project**, connect GitHub, and select `gangarajuguravaiah112004-stack/wellness`. Keep the base directory at the repository root; the build and publish settings are read from `netlify.toml`.
3. In the Netlify project's environment variables, add `MONGODB_URI` with the MongoDB Atlas connection string. Never commit the connection string to GitHub. Configure Atlas network access to permit connections from your deployment.
4. Deploy the site. The same-origin `/api/health` and `/api/consultations` routes are handled by the Netlify function.

To redeploy changes, push them to the connected GitHub branch.
