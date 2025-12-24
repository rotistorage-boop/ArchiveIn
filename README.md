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

# Configuration & Setup

## Environment Variables (.env)
Create a `.env` file in the root directory. You can copy the structure from `.env.example` if available.

### Database (Prisma/Turso)
- `DATABASE_URL`: The connection URL for your database (e.g. `libsql://...`).
- `DATABASE_AUTH_TOKEN`: The authentication token for Turso/LibSQL.

### Google Authentication & Services (OAuth2)
Used for User Login, Google Drive Storage, and Gmail Notifications.
- `GOOGLE_CLIENT_ID`: OAuth2 Client ID from Google Cloud Console.
- `GOOGLE_CLIENT_SECRET`: OAuth2 Client Secret.
- `GOOGLE_REDIRECT_URI`: Callback URL (e.g., `http://localhost:5173/login/google/callback` for dev).
- `GOOGLE_REFRESH_TOKEN`: Long-lived token to access Drive/Gmail offline (run `npm run get-token` to generate).

### Google Drive Storage
- `GOOGLE_DRIVE_FOLDER_ID`: The ID of the root folder in Google Drive where archives/gallery images will be stored (e.g., `1aBcDeFgHiJkLmNoPqRsTuVwXyZ`).

### ImageKit (CDN & Optimization)
- `IMAGEKIT_PUBLIC_KEY`: Public API Key.
- `IMAGEKIT_PRIVATE_KEY`: Private API Key.
- `IMAGEKIT_URL_ENDPOINT`: URL Endpoint (e.g., `https://ik.imagekit.io/your_id`).

### Application Config
- `ADMIN_EMAILS`: Comma-separated list of emails that have Admin access (e.g., `admin@example.com,dev@example.com`).

---

## Installation & Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Get Google Tokens (One-time Setup)**
   If you need a `GOOGLE_REFRESH_TOKEN`, run the helper script:
   ```bash
   npm run get-token
   ```
   Follow the link, authorize, and paste the code. The script will output your Refresh Token.

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Deployment

### Vercel / Netlify / Node.js
This project uses `@sveltejs/adapter-auto` (or specific adapter).
1. Ensure all **Environment Variables** are set in your deployment platform settings.
2. Build command: `npm run build`.
3. Start command: `node build` (if using node adapter) or automatic.

### Important Note on Google Tokens
The `GOOGLE_REFRESH_TOKEN` is critical for uploading to Drive and sending Emails. It expires if unused for 6 months or if revoked. Ensure your Google Cloud Project is set to **Production** (not Testing) to avoid 7-day token expiration.
