# Backend

Express backend using MVC with a services layer.

## Scripts

- `npm run dev` - Start the server with auto-reload
- `npm start` - Start the server

## Environment

Create a `.env` file using `.env.example` and adjust values.

## Sample Endpoint

- GET `/api/v1/health`

Returns service status metadata.

## Auth Endpoints

- POST `/api/v1/auth/signup`
- POST `/api/v1/auth/login`

## Interview Endpoints (JWT required)

- POST `/api/v1/interviews/sessions`
- POST `/api/v1/interviews/sessions/:sessionId/questions/next`
- POST `/api/v1/interviews/sessions/:sessionId/answers`
- POST `/api/v1/interviews/sessions/:sessionId/finish`
- GET `/api/v1/interviews/sessions`
- GET `/api/v1/interviews/sessions/:sessionId`

## Migrations

- [db/migrations/001_create_users_table.sql](db/migrations/001_create_users_table.sql)
- [db/migrations/002_create_interview_tables.sql](db/migrations/002_create_interview_tables.sql)
