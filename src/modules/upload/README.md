# Upload Module

Bu modul NestJS backend-də fayl yükləmə funksionallığını təmin edir.

## Xüsusiyyətlər

- Tək fayl yükləmə
- Çoxlu fayl yükləmə
- Şəkil faylları üçün xüsusi endpoint
- Sənəd faylları üçün xüsusi endpoint
- Fayl növü validasiyası
- Fayl ölçüsü məhdudiyyəti (10MB)
- Fayl silmə funksionallığı
- Fayl məlumatlarını əldə etmə

## API Endpoints

### 1. Tək Fayl Yükləmə
```
POST /upload/single
Content-Type: multipart/form-data
Body: file (binary)
```

### 2. Çoxlu Fayl Yükləmə
```
POST /upload/multiple
Content-Type: multipart/form-data
Body: files[] (binary array)
```

### 3. Şəkil Yükləmə
```
POST /upload/image
Content-Type: multipart/form-data
Body: image (binary)
```
Dəstəklənən formatlar: JPEG, JPG, PNG, GIF, WebP

### 4. Sənəd Yükləmə
```
POST /upload/document
Content-Type: multipart/form-data
Body: document (binary)
```
Dəstəklənən formatlar: PDF, DOC, DOCX, TXT

### 5. Fayl Silmə
```
DELETE /upload/:filename
```

### 6. Fayl Məlumatları
```
GET /upload/info/:filename
```

### 7. Dəstəklənən Fayl Növləri
```
GET /upload/types
GET /upload/types?category=images
GET /upload/types?category=documents
```

## İstifadə Nümunəsi

### Frontend-də JavaScript ilə
```javascript
// Tək fayl yükləmə
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('/upload/single', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  console.log('Yükləndi:', data.url);
});

// Şəkil yükləmə
const imageFormData = new FormData();
imageFormData.append('image', imageFile);

fetch('/upload/image', {
  method: 'POST',
  body: imageFormData
})
.then(response => response.json())
.then(data => {
  console.log('Şəkil yükləndi:', data.url);
});
```

### cURL ilə
```bash
# Tək fayl yükləmə
curl -X POST -F "file=@example.jpg" http://localhost:3000/upload/single

# Şəkil yükləmə
curl -X POST -F "image=@photo.png" http://localhost:3000/upload/image

# Fayl silmə
curl -X DELETE http://localhost:3000/upload/example-123456789.jpg
```

## Konfiqurasiya

- Maksimum fayl ölçüsü: 10MB (ümumi), 5MB (şəkillər)
- Yükləmə qovluğu: `public/uploads/`
- Dəstəklənən şəkil formatları: JPEG, JPG, PNG, GIF, WebP
- Dəstəklənən sənəd formatları: PDF, DOC, DOCX, TXT

## Təhlükəsizlik

- Fayl növü validasiyası
- Fayl ölçüsü məhdudiyyəti
- Unikal fayl adları (timestamp + random)
- Yalnız icazə verilən MIME növləri

## Response Format

### Uğurlu Yükləmə
```json
{
  "url": "/uploads/1640995200000-123456789.jpg",
  "filename": "1640995200000-123456789.jpg",
  "size": 1024000
}
```

### Xəta
```json
{
  "statusCode": 400,
  "message": "No file provided",
  "error": "Bad Request"
}
```
