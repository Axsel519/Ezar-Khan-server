# Image Upload Feature - Quick Summary 📸

## ✅ What's Included

Your e-commerce API now has a **complete image upload system** with:

- ✅ Upload single or multiple images
- ✅ Store images in MongoDB GridFS
- ✅ Get direct URLs for each image
- ✅ Stream images efficiently
- ✅ Admin-only upload/delete
- ✅ Public image viewing
- ✅ File validation (format & size)

## 🚀 Quick Start

### 1. Upload Images (Admin)

**Using Swagger UI (Easiest):**
1. Go to http://localhost:3000/api
2. Login as admin and authorize
3. Find `POST /uploads/images`
4. Upload your images
5. Copy the returned URLs

**Using cURL:**
```bash
curl -X POST http://localhost:3000/uploads/images \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -F "files=@image1.jpg" \
  -F "files=@image2.jpg"
```

**Response:**
```json
[
  {
    "id": "65ba1234567890abcdef0001",
    "url": "http://localhost:3000/uploads/65ba1234567890abcdef0001",
    "filename": "image1.jpg"
  },
  {
    "id": "65ba1234567890abcdef0002",
    "url": "http://localhost:3000/uploads/65ba1234567890abcdef0002",
    "filename": "image2.jpg"
  }
]
```

### 2. Create Product with Images

```bash
curl -X POST http://localhost:3000/products \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wireless Headphones",
    "description": "Premium quality headphones",
    "price": 199.99,
    "stock": 50,
    "category": "Electronics",
    "images": [
      "http://localhost:3000/uploads/65ba1234567890abcdef0001",
      "http://localhost:3000/uploads/65ba1234567890abcdef0002"
    ]
  }'
```

### 3. View Images

**In Browser:**
```
http://localhost:3000/uploads/65ba1234567890abcdef0001
```

**In HTML:**
```html
<img src="http://localhost:3000/uploads/65ba1234567890abcdef0001" alt="Product" />
```

**In React:**
```jsx
<img src={product.images[0]} alt={product.name} />
```

## 📋 API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /uploads/image | Admin | Upload single image |
| POST | /uploads/images | Admin | Upload multiple images |
| GET | /uploads/:id | Public | Get/stream image |
| GET | /uploads | Admin | List all images |
| DELETE | /uploads/:id | Admin | Delete image |

## 📝 File Specifications

- **Formats:** JPG, JPEG, PNG, GIF, WebP
- **Max Size:** 5MB per image
- **Max Count:** 10 images per upload
- **Storage:** MongoDB GridFS

## 🎯 Complete Workflow Example

```bash
# 1. Login as admin
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin@123456"}'

# Save the token!

# 2. Upload images
curl -X POST http://localhost:3000/uploads/images \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "files=@product1.jpg" \
  -F "files=@product2.jpg"

# Copy the URLs from response!

# 3. Create product with image URLs
curl -X POST http://localhost:3000/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "description": "Product description",
    "price": 99.99,
    "stock": 50,
    "category": "Electronics",
    "images": ["URL1", "URL2"]
  }'

# 4. Get product (images included)
curl http://localhost:3000/products/{productId}

# 5. View image in browser
# Open: http://localhost:3000/uploads/{imageId}
```

## 🧪 Testing Checklist

- [ ] Upload single image as admin ✅
- [ ] Upload multiple images as admin ✅
- [ ] Get image URL ✅
- [ ] View image in browser ✅
- [ ] Create product with image URLs ✅
- [ ] View product with images ✅
- [ ] List all uploaded images ✅
- [ ] Delete image ✅
- [ ] Verify customer cannot upload (403) ✅
- [ ] Verify public can view images ✅

## 📚 Documentation

For detailed information, see:
- **IMAGE_UPLOAD_GUIDE.md** - Complete guide with examples
- **TEST_ROUTES.md** - All API routes
- **Swagger UI** - http://localhost:3000/api

## 🎉 You're Ready!

Your image upload system is complete! You can now:
1. Upload product images
2. Store them in MongoDB
3. Get direct URLs
4. Display them in your frontend

**Everything works out of the box!** 🚀
