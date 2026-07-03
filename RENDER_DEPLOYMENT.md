# MnCHub Render Deployment Guide

## Backend Deployment on Render

### Step 1: Connect GitHub to Render
1. Go to [render.com](https://render.com)
2. Sign in with GitHub
3. Click "Create +" → "Web Service"
4. Select your GitHub repository
5. Configure:
   - **Name**: `mnchub-backend`
   - **Runtime**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free (or Starter)

### Step 2: Set Environment Variables in Render Dashboard

Add these environment variables in Render's dashboard:

```
NODE_ENV=production
PORT=10000
CLIENT_URL=https://mnchubs.vercel.app
FRONTEND_URL=https://mnchubs.vercel.app
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
CLOUDINARY_CLOUD_NAME=dvcjyastv
CLOUDINARY_API_KEY=226512173873539
CLOUDINARY_API_SECRET=U3HpzcVrsH1Os4fa9O00nTD6cQg
REDIS_URL=your_redis_url
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=mnchubs1911@gmail.com
SMTP_PASS=xcirowfnzhjxmxef
FIREBASE_PROJECT_ID=mnchubs-251ec
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@mnchubs-251ec.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FROM_EMAIL=noreply@mnchub.com
FROM_NAME=MnCHub
```

### Step 3: Deploy Backend
After configuration, Render automatically deploys. Your backend URL will be:
```
https://mnchub-backend.onrender.com
```

### Step 4: Update Frontend Configuration

After backend URL is deployed, update:

**`frontend/.env.production`**:
```
VITE_API_URL=https://mnchub-backend.onrender.com/api/v1
VITE_SOCKET_URL=https://mnchub-backend.onrender.com
```

**`frontend/.env`** (for local development):
```
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

### Step 5: Commit and Deploy Frontend

```bash
git add .
git commit -m "Deploy: Backend to Render, update API endpoints"
git push
```

Vercel will automatically redeploy your frontend with the new API endpoints.

### Step 6: Test Login

1. Visit `https://mnchubs.vercel.app`
2. Try logging in from different devices
3. Cookies should now work across devices ✅

## Architecture

```
┌─────────────────────────────────────┐
│   Frontend (Vercel)                 │
│   https://mnchubs.vercel.app        │
└─────────────────────────────────────┘
            ↓ API calls
┌─────────────────────────────────────┐
│   Backend (Render)                  │
│   https://mnchub-backend.onrender.com
│   /api/v1/*                         │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│   MongoDB (Atlas)                   │
│   Firebase (Auth)                   │
│   Redis (Cache)                     │
└─────────────────────────────────────┘
```

## Troubleshooting

### Cold Start Issues
- Render free tier has 15-minute inactivity timeout
- Backend wakes up on first request (may take 30 seconds)

### CORS Errors
- Already configured for `.onrender.com` domains
- Make sure `FRONTEND_URL` environment variable is set

### Socket.io Connection Issues
- Ensure `VITE_SOCKET_URL` matches backend URL
- Must include full domain, not relative paths

## Files Modified
- ✅ `backend/src/app.js` - Added Render CORS support
- ✅ `backend/src/server.js` - Enhanced Socket.io config
- ✅ `backend/.env.render` - Render environment template
- ✅ `frontend/.env.render` - Frontend Render config
- ✅ `render.yaml` - Render deployment config
