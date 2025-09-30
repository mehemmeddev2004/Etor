# Render.com Deploy Təlimatları

## 1. Hazırlıq

### Repo GitHub-a yükləyin
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

## 2. Render.com-da Deploy

### Database Yaradın
1. Render.com-a daxil olun
2. "New" > "PostgreSQL" seçin
3. Database adı: `etor-postgres`
4. Plan: Free
5. "Create Database" düyməsini basın

### Web Service Yaradın
1. "New" > "Web Service" seçin
2. GitHub repo-nu connect edin
3. Aşağıdakı parametrləri daxil edin:

**Build & Deploy:**
- Build Command: `npm ci && npm run build`
- Start Command: `npm run start:prod`

**Environment Variables:**
```
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
SMTP_FROM=your_email@gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
FIREBASE_PROJECT_ID=etor-e05df
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY=your_private_key_content
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@etor-e05df.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_CLIENT_X509_CERT_URL=your_cert_url
```

Database variables avtomatik əlavə olunacaq.

## 3. SSL və Domain

Render avtomatik SSL sertifikatı təmin edir. Custom domain üçün:
1. Service Settings > Custom Domains
2. Domain əlavə edin
3. DNS records-u konfiqurasiya edin

## 4. Monitoring

- Logs: Service dashboard-da "Logs" tab
- Metrics: "Metrics" tab-da performance məlumatları
- Health checks: `/api/health` endpoint əlavə edin

## 5. Troubleshooting

### Ümumi problemlər:
- Build failures: `package.json` scripts-i yoxlayın
- Database connection: Environment variables-i yoxlayın
- CORS errors: `FRONTEND_URL` düzgün təyin edin

### Faydalı komandalar:
```bash
# Local test
npm run build
npm run start:prod

# Logs
render logs --service your-service-name
```
