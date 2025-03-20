# Photo Gallery Application

A full-stack photo gallery application built with React, TypeScript, and Node.js. The application allows users to upload, view, and manage their photos with metadata.

## Features

- Photo upload with metadata (title, description, date taken, location, film info)
- Responsive photo grid display
- Photo detail view
- Local file storage
- PostgreSQL database for metadata storage

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v15 or higher)
- npm or yarn

## Project Structure

```
.
├── backend/           # Node.js/Express backend
│   ├── src/          # Source code
│   ├── uploads/      # Local file storage
│   └── package.json  # Backend dependencies
└── frontend/         # React frontend
    ├── src/         # Source code
    └── package.json # Frontend dependencies
```

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd photo-gallery
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up the database:
```bash
cd ../backend
PGPASSWORD=testconnectnegatives psql -h localhost -U postgres -c "CREATE DATABASE photo_gallery;"
PGPASSWORD=testconnectnegatives psql -h localhost -U postgres -d photo_gallery -f src/db/schema.sql
```

5. Create environment files:

Backend (.env):
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=photo_gallery
DB_USER=postgres
DB_PASSWORD=testconnectnegatives
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

Frontend (.env):
```
VITE_API_URL=http://localhost:3001
```

## Development

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Deployment

The application is configured for deployment to Google Cloud Platform:

1. Set up GCP resources using the setup script:
```bash
./scripts/setup-frontend.sh
```

2. Configure GitHub Actions for automated deployment:
- Add the GCP service account key as a GitHub secret named `GCP_SA_KEY`
- Push to the main branch to trigger deployment

## License

MIT 