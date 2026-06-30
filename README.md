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
1. Import `backend/` folder as a new Vercel project
2. Add ALL environment variables from `backend/.env.example`
3. Deploy

### Frontend
1. Import `frontend/` folder as a new Vercel project
2. Set `VITE_API_URL` to your backend Vercel URL + `/api/v1`
3. Add all Firebase `VITE_FIREBASE_*` variables
4. Deploy
