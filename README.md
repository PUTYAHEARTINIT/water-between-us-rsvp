# Water Between Us - RSVP System

A fully functional RSVP system for the Water Between Us listening party with email tracking and admin dashboard.

## Features

- Beautiful, responsive RSVP form
- Real-time guest count
- Email collection and tracking
- Admin dashboard to view all RSVPs
- Export RSVPs to CSV
- Copy all emails with one click

## Quick Start

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open your browser:
   - RSVP Page: http://localhost:3000
   - Admin Dashboard: http://localhost:3000/admin.html

### Development with auto-reload:
```bash
npm run dev
```

## Deployment Options

### Option 1: Railway (Recommended - Easiest)

1. Go to [Railway.app](https://railway.app)
2. Sign up/login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select this repository
5. Railway will auto-detect Node.js and deploy
6. Your site will be live at `yourproject.railway.app`

### Option 2: Render

1. Go to [Render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Click "Create Web Service"

### Option 3: Fly.io

1. Install [Fly CLI](https://fly.io/docs/hands-on/install-flyctl/)
2. Login: `fly auth login`
3. Launch: `fly launch`
4. Deploy: `fly deploy`

### Option 4: DigitalOcean App Platform

1. Go to [DigitalOcean](https://www.digitalocean.com/products/app-platform)
2. Click "Create App"
3. Connect your GitHub repository
4. Select Node.js environment
5. Deploy

## File Structure

```
water-between-us-rsvp/
├── index.html          # Main RSVP page
├── admin.html          # Admin dashboard
├── server.js           # Backend API server
├── package.json        # Dependencies
├── rsvps.json          # RSVP data (auto-generated)
└── README.md           # This file
```

## API Endpoints

- `POST /api/rsvp` - Submit an RSVP
- `GET /api/rsvps` - Get all RSVPs
- `GET /api/rsvps/count` - Get RSVP count
- `GET /api/admin/emails` - Get all emails (for admin)

## Admin Dashboard Features

- View all RSVPs in a table
- See total RSVPs and total guests
- Download all data as CSV
- Copy all email addresses at once
- Real-time refresh

## Security Note

The admin dashboard is currently open. For production, you should add authentication:

1. Add a password check in `server.js`
2. Use environment variables for credentials
3. Consider using a service like Auth0 or Firebase Auth

## Data Storage

RSVPs are stored in `rsvps.json` file. For production with high traffic, consider:
- PostgreSQL (via Railway, Render, or Supabase)
- MongoDB (via MongoDB Atlas)
- SQLite (built-in, works for small-medium events)

## Support

For issues or questions, contact the developer.
