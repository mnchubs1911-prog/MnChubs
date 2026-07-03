# MnCHub — College Resource Sharing Platform

## Local Development

### Backend
```bash
cd backend
npm install
# Create .env from .env.example and fill in values
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# Create .env from .env.example and fill in values  
npm run dev
```

## Vercel Deployment

### Backend
1. Create a new Vercel project using the `backend/` folder.
2. Vercel will use `backend/vercel.json` to deploy the Node API.
3. Add these environment variables in Vercel:
   - `NODE_ENV=production`
   - `MONGO_URI=your_mongodb_connection_string`
   - `JWT_SECRET=your_jwt_secret`
   - `JWT_REFRESH_SECRET=your_jwt_refresh_secret`
   - `JWT_EXPIRE=7d`
   - `JWT_REFRESH_EXPIRE=30d`
   - `CLOUDINARY_CLOUD_NAME=...`
   - `CLOUDINARY_API_KEY=...`
   - `CLOUDINARY_API_SECRET=...`
   - `SMTP_HOST=smtp.gmail.com`
   - `SMTP_PORT=587`
   - `SMTP_USER=your_email@gmail.com`
   - `SMTP_PASS=your_email_app_password`
   - `FRONTEND_URL=https://your-frontend-url`
   - `CLIENT_URL=https://your-frontend-url`
   - `FIREBASE_PROJECT_ID=...`
   - `FIREBASE_CLIENT_EMAIL=...`
   - `FIREBASE_PRIVATE_KEY=...`
4. Deploy.

### Frontend
1. Create a new Vercel project using the `frontend/` folder.
2. Vercel will build with `npm run build` and publish the `dist/` folder.
3. Add these environment variables in Vercel:
   - `VITE_API_URL=https://your-backend-url/api/v1`
   - `VITE_SOCKET_URL=https://your-backend-url`
   - `VITE_FIREBASE_API_KEY=...`
   - `VITE_FIREBASE_AUTH_DOMAIN=...`
   - `VITE_FIREBASE_PROJECT_ID=...`
   - `VITE_FIREBASE_STORAGE_BUCKET=...`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID=...`
   - `VITE_FIREBASE_APP_ID=...`
4. Deploy.

### Notes
- Backend and frontend are separate Vercel projects.
- The backend API uses `backend/vercel.json` and exports the Express app from `backend/src/app.js`.
- The frontend uses `frontend/vercel.json` to rewrite client-side routes to `index.html`.
- Deploy backend first, then set `VITE_API_URL` in frontend to the backend URL.
