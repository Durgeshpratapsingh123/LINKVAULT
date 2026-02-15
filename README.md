# LinkVault - Secure Paste Sharing Platform

A full-stack web application for secure, temporary sharing of text and files with advanced privacy controls including password protection, auto-expiration, and view limits.

**Design Lab Project**  
Durgesh Pratap Singh  
MTech CSE, IIT Kharagpur  
February 2026

---

## Features

- 🔒 **Password Protection** - Encrypt pastes with passwords
- ⏱️ **Auto-Expiration** - Set custom or preset expiry times
- 👁️ **View Limits** - Control how many times content can be viewed
- 📁 **File Sharing** - Share files up to 10MB
- 🔐 **One-Time View** - Self-destructing pastes
- 👤 **User Accounts** - Track and manage your pastes
- 🌓 **Dark Mode** - Full theme support
- 📧 **Email Verification** - Secure account creation
- 🔑 **Google OAuth** - Quick sign-in with Google

---

## Tech Stack

**Frontend:**
- React 18.3 with Vite
- React Router DOM for navigation
- Tailwind CSS for styling
- Framer Motion for animations
- Axios for API calls

**Backend:**
- Node.js with Express.js
- MongoDB Atlas (NoSQL database)
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads
- Nodemailer for email services
- Passport.js for OAuth

---

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Gmail account for email services
- Google Cloud Console project (for OAuth)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd LinkVault
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRE=7d
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=http://localhost:5173
```

**Setting up Gmail App Password:**
1. Go to Google Account Settings
2. Security → 2-Step Verification (enable if not enabled)
3. App Passwords → Generate new app password
4. Copy 16-character password (remove spaces)

**Setting up Google OAuth:**
1. Go to Google Cloud Console
2. Create new project or select existing
3. APIs & Services → Credentials
4. Create OAuth 2.0 Client ID
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/oauth/google/callback`
6. Copy Client ID and Secret

Start backend:
```bash
npm start
```

Server runs on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## API Overview

### Public Endpoints

**POST /api/upload**
- Upload text or file paste
- Headers: Optional `Authorization: Bearer <token>`
- Body (FormData):
  - `text` or `file`
  - `expiresIn` (seconds)
  - `password` (optional)
  - `oneTimeView` (boolean)
  - `maxViews` (number, optional)
- Returns: `{ id, url, deleteToken, expiresAt }`

**GET /api/view/:pasteId**
- View a paste
- Query: `password` (if protected)
- Returns paste content or file metadata

**GET /api/file/:pasteId**
- Download file
- Returns file stream

**DELETE /api/delete/:pasteId**
- Delete a paste
- Headers: `x-delete-token: <deleteToken>`

**GET /api/pastes/check**
- Check if paste exists
- Query: `pasteId`

### Authentication Endpoints

**POST /api/auth/register**
- Register new user
- Body: `{ username, email, password }`
- Returns JWT token

**POST /api/auth/login**
- Login user
- Body: `{ email, password }`
- Returns JWT token

**GET /api/auth/verify-email/:token**
- Verify email address

**POST /api/auth/forgot-password**
- Request password reset
- Body: `{ email }`

**POST /api/auth/reset-password/:token**
- Reset password
- Body: `{ password }`

**GET /api/auth/me**
- Get current user (requires auth)

### User Endpoints (Protected)

**GET /api/user/profile**
- Get user profile

**PUT /api/user/profile**
- Update profile
- Body: `{ username }`

**POST /api/user/change-password**
- Change password
- Body: `{ currentPassword, newPassword }`

**DELETE /api/user/account**
- Delete user account and all pastes

**GET /api/user/pastes**
- Get user's pastes

### OAuth Endpoints

**GET /api/oauth/google**
- Initiate Google OAuth flow

**GET /api/oauth/google/callback**
- Google OAuth callback

---

## Design Decisions

### 1. Dual Storage System
**Decision:** Support both anonymous and authenticated pastes  
**Rationale:** Allows quick, no-signup usage while offering account benefits  
**Implementation:** 
- Anonymous: localStorage + deleteToken
- Authenticated: MongoDB + userId linking

### 2. MongoDB Over SQL
**Decision:** Use MongoDB (NoSQL)  
**Rationale:**
- Flexible schema for paste metadata
- Easy horizontal scaling
- Better for document-like paste structures
- Simple JSON-like queries

### 3. JWT Authentication
**Decision:** Stateless JWT tokens  
**Rationale:**
- No server-side session storage needed
- Scalable across multiple servers
- Works well with REST API design
- Mobile-friendly

### 4. Client-Side Expiry Tracking
**Decision:** Live countdown timers in UI  
**Rationale:**
- Better UX with real-time updates
- Reduces server polling
- Immediate feedback to users

### 5. Separate Delete Tokens
**Decision:** Generate unique delete tokens independent of auth  
**Rationale:**
- Anonymous users can still delete their pastes
- Prevents unauthorized deletion
- Simple to share with paste link

### 6. File Storage on Disk
**Decision:** Store files in local filesystem vs cloud  
**Rationale:**
- Simpler implementation for academic project
- No external storage costs
- Faster development iteration
- Production could migrate to S3/Cloudinary

### 7. Email Verification Optional for Usage
**Decision:** Allow unverified users to use the platform  
**Rationale:**
- Reduces friction in signup flow
- Verification only for full account features
- Better conversion rates

### 8. Background Cleanup Job
**Decision:** Cron job for expired paste deletion  
**Rationale:**
- Automatic cleanup without manual intervention
- Prevents database bloat
- Runs every 5 minutes
- Deletes expired pastes and associated files

---

## Assumptions and Limitations

### Assumptions

1. **Network Reliability**
   - Assumes stable internet for MongoDB Atlas connection
   - No offline mode implemented

2. **User Behavior**
   - Users will not intentionally abuse the system
   - File uploads are legitimate (no malware scanning)

3. **Scale**
   - Designed for moderate traffic (academic project)
   - Not optimized for millions of concurrent users

4. **Security**
   - HTTPS assumed in production (not enforced in dev)
   - Users will keep their passwords secure

5. **Browser Support**
   - Modern browsers with ES6+ support
   - localStorage available

### Limitations

1. **File Size**
   - Maximum 10MB per file
   - Larger files not supported due to server memory constraints

2. **Storage**
   - Files stored on server disk (single point of failure)
   - No redundancy or backup system

3. **Concurrency**
   - No distributed locking for paste views
   - Race conditions possible with rapid concurrent views

4. **Email Delivery**
   - Relies on Gmail SMTP (rate limits apply)
   - No queuing system for failed emails
   - Limited to ~500 emails/day with free Gmail

5. **Search Functionality**
   - No full-text search on paste content
   - Users must remember paste IDs or use dashboard

6. **Rate Limiting**
   - No API rate limiting implemented
   - Vulnerable to abuse without proper limits

7. **File Types**
   - No file type restrictions
   - No virus/malware scanning

8. **Geographical Distribution**
   - Single server deployment
   - No CDN for faster global access

9. **Mobile App**
   - Web-only, no native mobile apps

10. **Encryption**
    - Passwords stored as hashes (bcrypt)
    - Paste content not encrypted at rest
    - HTTPS required for transport security

11. **Backup and Recovery**
    - No automated backup system
    - Manual MongoDB backups required

12. **Analytics**
    - Basic view counts only
    - No detailed analytics or logging

---

## Project Structure
```
LinkVault/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # API routes
│   │   ├── middlewares/      # Auth, validation
│   │   ├── utils/            # Helper functions
│   │   ├── jobs/             # Background jobs
│   │   └── server.js         # Entry point
│   ├── uploads/              # File storage
│   ├── .env                  # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── context/          # React Context (Auth, Theme)
│   │   ├── services/         # API service
│   │   ├── utils/            # Helper functions
│   │   └── App.jsx           # Root component
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## Future Enhancements

- [ ] API rate limiting
- [ ] File type validation and malware scanning
- [ ] CDN integration for file delivery
- [ ] Advanced analytics dashboard
- [ ] Paste templates and favorites
- [ ] Collaborative editing
- [ ] QR code generation for paste links
- [ ] Paste encryption at rest
- [ ] Multi-language support
- [ ] Mobile apps (iOS/Android)
- [ ] Paste collections/folders
- [ ] Custom domains for pastes
- [ ] Webhook notifications

---

## License

This project is created for academic purposes as part of Design Lab course at IIT Kharagpur.

---

## Author

**Durgesh Pratap Singh**  
MTech Computer Science & Engineering  
Indian Institute of Technology, Kharagpur  
```

---
