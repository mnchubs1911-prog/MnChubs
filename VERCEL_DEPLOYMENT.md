# MnCHub Vercel Deployment Guide

## ✅ Local Testing Complete

Both services are running successfully:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000

---

## 🚀 Vercel Deployment Steps

### Step 1: Prepare Your GitHub Repository

Ensure all changes are committed and pushed:

```bash
git add .
git commit -m "Deploy: Migrate to Vercel, remove Render configuration"
git push origin main
```

### Step 2: Deploy Backend to Vercel

#### 2.1 Create Vercel Project for Backend

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Select your MnC.Hub repository
5. Configure:
   - **Project Name**: `mnchubs-api` (or your choice)
   - **Framework**: `Other` (since it's custom Node.js)
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Output Directory**: Leave empty
   - **Environment**: Add these variables below

#### 2.2 Add Environment Variables

In Vercel dashboard, add these environment variables:

```
NODE_ENV=production
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
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
CLIENT_URL=https://mnchubs.vercel.app
FRONTEND_URL=https://mnchubs.vercel.app
```

#### 2.3 Deploy

Click "Deploy" and wait for completion. You'll get a URL like:
```
https://mnchubs-api.vercel.app
```

### Step 3: Update Frontend with Backend URL

After backend deployment completes:

#### 3.1 Update Production Environment File

Edit `frontend/.env.production`:

```env
VITE_API_URL=https://mnchubs-api.vercel.app/api/v1
VITE_SOCKET_URL=https://mnchubs-api.vercel.app

# Firebase Web App Config (these are already correct)
VITE_FIREBASE_API_KEY="AIzaSyDnb5CyTap1DUFhCMCztevFY8pHb30HCHw"
VITE_FIREBASE_AUTH_DOMAIN="mnchubs-251ec.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="mnchubs-251ec"
VITE_FIREBASE_STORAGE_BUCKET="mnchubs-251ec.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="162150050240"
VITE_FIREBASE_APP_ID="1:162150050240:web:2b33a5cce024cb1551c025"
VITE_FIREBASE_MEASUREMENT_ID="G-T8MCCQC1P1"
```

*(Replace `mnchubs-api.vercel.app` with your actual backend Vercel domain if different)*

#### 3.2 Commit & Push

```bash
git add frontend/.env.production
git commit -m "Deploy: Update frontend API endpoints for production"
git push origin main
```

### Step 4: Deploy Frontend to Vercel

#### 4.1 Create Vercel Project for Frontend

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Select your MnC.Hub repository
4. Configure:
   - **Project Name**: `mnchubs` (or your choice)
   - **Framework**: `React` (or `Vite` if available)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**: None needed (uses `.env.production`)

#### 4.2 Deploy

Click "Deploy" and wait for completion. You'll get a URL like:
```
https://mnchubs.vercel.app
```

### Step 5: Test Everything

1. Visit your frontend URL: https://mnchubs.vercel.app
2. Try logging in
3. Test API endpoints (create resources, chat, etc.)
4. Verify database connections
5. Check console for any CORS or connection errors

---

## 🔧 Troubleshooting

### CORS Errors
If you see CORS errors, verify:
- Backend environment variables include correct `CLIENT_URL` and `FRONTEND_URL`
- Frontend `.env.production` has correct API URL
- Backend CORS middleware allows `*.vercel.app` domains ✅ (already configured)

### Socket.io Errors
- Backend Socket.io CORS is configured to accept all `*.vercel.app` origins ✅
- Verify `VITE_SOCKET_URL` matches backend URL in frontend

### Database Errors
- Verify `MONGO_URI` is correct and accessible from Vercel
- Check MongoDB Atlas allows Vercel IP ranges
- Consider using MongoDB Atlas network access settings

### File Upload Errors
- Verify Cloudinary credentials are correct
- Check Cloudinary API key and secret in backend env

---

## 📁 Architecture

```
┌──────────────────────────────────────────┐
│   Frontend (Vercel)                      │
│   https://mnchubs.vercel.app             │
│   (Vite React App)                       │
└──────────────────────────────────────────┘
            ↓ API calls
┌──────────────────────────────────────────┐
│   Backend (Vercel)                       │
│   https://mnchubs-api.vercel.app         │
│   /api/v1/*                              │
└──────────────────────────────────────────┘
            ↓
┌──────────────────────────────────────────┐
│   External Services                      │
│   • MongoDB Atlas (Database)             │
│   • Firebase (Auth)                      │
│   • Redis (Cache)                        │
│   • Cloudinary (Image Storage)           │
│   • SMTP (Email)                         │
└──────────────────────────────────────────┘
```

---

## 📝 Environment Variables Reference

### Backend (Required for Production)

| Variable | Example | Purpose |
|----------|---------|---------|
| `NODE_ENV` | `production` | Runtime mode |
| `MONGO_URI` | `mongodb+srv://...` | Database connection |
| `JWT_SECRET` | 64-char string | Authentication |
| `JWT_REFRESH_SECRET` | 64-char string | Token refresh |
| `CLOUDINARY_CLOUD_NAME` | `dvcjyastv` | Image uploads |
| `REDIS_URL` | `https://...` | Cache service |
| `SMTP_USER` | `email@gmail.com` | Email sending |
| `FIREBASE_PROJECT_ID` | `mnchubs-251ec` | Firebase auth |

### Frontend (Uses .env.production)

| Variable | Example | Purpose |
|----------|---------|---------|
| `VITE_API_URL` | `https://mnchubs-api.vercel.app/api/v1` | Backend API |
| `VITE_SOCKET_URL` | `https://mnchubs-api.vercel.app` | WebSocket |
| `VITE_FIREBASE_API_KEY` | Firebase key | Firebase auth |

---

## ✨ Next Steps After Deployment

1. **Monitor**: Check Vercel Analytics & Logs
2. **Setup CI/CD**: Enable automatic deployments on git push
3. **Custom Domain**: Add your domain (mnchub.com) in Vercel settings
4. **SSL Certificate**: Automatically handled by Vercel
5. **Performance**: Monitor and optimize with Vercel's built-in tools

---

## 📞 Support

For issues:
1. Check Vercel deployment logs
2. Review backend console errors
3. Verify environment variables
4. Test locally first with `npm run dev`

Happy deploying! 🚀
