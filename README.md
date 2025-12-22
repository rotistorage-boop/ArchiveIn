# ArchiveIn Project

## Purpose

This project aims to provide a comprehensive and user-friendly system for archiving various academic and practical materials. It features a hierarchical navigation structure, rich content display for detailed items, and a dynamic frontend for an engaging user experience.

## Development Status

This project is currently in active development. Features are being continuously implemented and and refined.

## Technologies Used

- SvelteKit (Frontend Framework)
- Drizzle ORM (Database Toolkit)
- SQLite (Database)
- Tailwind CSS (Styling)
- Lucide Icons (Iconography)

## Setup and Running Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/rotistorage-boop/ArchiveIn.git
    cd ArchiveIn
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Database Setup:**
    - Ensure you have a `.env` file (you can copy `.env.example`).
    - Generate and run database migrations:
      ```bash
      npm run db:generate
      npm run db:migrate
      ```
    - Seed initial data (this will reset your database content):
      ```bash
      npx tsx src/lib/server/db/seed.ts
      ```
4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    Open your browser to `http://localhost:5173` (or the port specified in your terminal).

-
