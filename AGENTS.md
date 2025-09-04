# Agent Instructions for "Died Today" Web App

This document provides instructions for LLM agents working on this codebase.

## Project Overview

This project is a web application that displays notable people who have recently passed away, based on data from Wikipedia. It's a monorepo containing a frontend and a backend, both written in TypeScript.

## Architecture Overview

- **Backend**: A Node.js/Express app that fetches data from Wikipedia, parses it, and stores it in a SQLite database using Prisma. It serves the data via a REST API.
- **Frontend**: A React app that displays the data from the backend in a swipeable card interface using the Swiper.js library.

## Key Files

When working on the project, you will most likely be interested in the following files:

- `backend/src/wikipedia.service.ts`: This is the heart of the backend. It contains all the logic for fetching data from Wikipedia, parsing it to find deaths, extracting person details, and saving them to the database.
- `backend/src/index.ts`: The entry point for the backend Express server. It defines the API endpoints and runs the background job to fetch data.
- `prisma/schema.prisma`: The Prisma schema file that defines the structure of the database.
- `frontend/src/App.tsx`: The main React component for the frontend application. It handles fetching the data from the API and rendering the main layout and the swipeable card container.
- `frontend/src/PersonCard.tsx`: The React component responsible for rendering the content of a single person's card.

## Development Workflow

- The project is a monorepo, but the frontend and backend are separate applications.
- To install all dependencies for both applications, run `npm install` in the root directory.
- The backend can be started in development mode with `npm run backend:dev`. This uses `nodemon` to automatically restart the server on file changes.
- The frontend can be started with `npm run frontend:start`. This uses the standard Create React App development server with hot-reloading.
- The frontend development server is configured to proxy API requests to `http://localhost:3001` to avoid CORS issues. This is configured in the `proxy` field in `package.json`.

## Common Tasks

- **Modifying the data pipeline**: If you need to change how data is fetched or parsed, you will need to edit `backend/src/wikipedia.service.ts`.
- **Changing the API**: To add or modify API endpoints, you'll need to edit `backend/src/index.ts` and potentially `backend/src/wikipedia.service.ts`.
- **Updating the UI**: For UI changes, you will likely be working in `frontend/src/App.tsx` (for the overall layout and data flow) and `frontend/src/PersonCard.tsx` (for the card content and styling).
- **Database schema changes**: If you need to change the database schema, edit `prisma/schema.prisma`, and then run `npx prisma migrate dev --name <migration-name>` to create a new migration and apply it to the database. Remember to also run `npx prisma generate` to update the Prisma client.
