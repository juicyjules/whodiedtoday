# Died Today Web App

This project is a web application that displays notable people who have recently passed away, based on data from Wikipedia.

## Architecture

The project is a monorepo containing a frontend and a backend, both written in TypeScript.

### Backend

The backend is a Node.js application using the Express framework. Its main responsibilities are:

- **Data Ingestion**: Periodically fetches recent changes from the English Wikipedia using the MediaWiki API.
- **Death Event Detection**: Filters the recent changes to identify edits related to the deaths of notable people by looking for keywords in edit comments.
- **Data Extraction**: Fetches the full Wikipedia page for each potential death and parses the content to extract structured data (name, image, biography, etc.).
- **Data Persistence**: Stores the curated information in a **SQLite** database using the **Prisma** ORM. This prevents re-processing and provides a stable data source.
- **API Layer**: Exposes a RESTful API for the frontend to consume.

### Frontend

The frontend is a single-page application built with **React**.

- **UI/UX**: It features a "Tinder-style" swipeable card interface for browsing through the deceased individuals. This is implemented using the **Swiper** library.
- **API Integration**: It communicates with the backend API to fetch the list of people.
- **State Management**: It uses React hooks (`useState`, `useEffect`) for state management.

## How to Run the Application

1.  **Install Dependencies**:
    Navigate to the root of the project and run:
    ```bash
    npm install
    ```

2.  **Run the Backend**:
    To start the backend development server, run:
    ```bash
    npm run backend:dev
    ```
    The backend will be available at `http://localhost:3001`.

3.  **Run the Frontend**:
    To start the frontend development server, run:
    ```bash
    npm run frontend:start
    ```
    The frontend will be available at `http://localhost:3000`. It is configured to proxy API requests to the backend server.
