# Image Upload Guide 📸

Complete guide for uploading, storing, and retrieving product images using MongoDB GridFS.

## 🎯 Features

- ✅ Upload single or multiple images
- ✅ Store images in MongoDB GridFS
- ✅ Get direct URLs for images
- ✅ Stream images efficiently
- ✅ Delete images
- ✅ List all uploaded images
- ✅ Admin-only upload/delete
- ✅ Public image access
- ✅ File size limit (5MB per image)
- ✅ Image format validation (jpg, jpeg, png, gif, webp)
- ✅ Caching headers for performance

## 📋 API Endpoints

### 1. Upload Single Image (Admin Only)
```http
POST http://localhost:3000/uploads/image
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: multipart/form-data

Form Data:
- file: [select image file]
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "url": "http://localhost:3000/uploads/507f1f77bcf86cd799439011",
  "filename": "product-image.jpg"
}
```

### 2. Upload Multiple Images (Admin Only)
```http
POST http://localhost:3000/uploads/images
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: multipart/form-data

Form Data:
- files: [select multiple image files, max 10]
```

**Response:**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "url": "http://localhost:3000/uploads/507f1f77bcf86cd799439011",
    "filename": "product-image-1.jpg"
  },
  {
    "id": "507f1f77bcf86cd799439012",
    "url": "http://localhost:3000/uploads/507f1f77bcf86cd799439012",
    "filename": "product-image-2.jpg"
  }
]
```

### 3. Get Image (Public)
```http
GET http://localhost:3000/uploads/{imageId}
```

This streams the image directly - use this URL in your frontend!

### 4. List All Images (Admin Only)
```http
GET http://localhost:3000/uploads
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Response:**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "filename": "product-image.jpg",
    "size": 245678,
    "uploadDate": "2024-01-31T12:00:00.000Z"
  }
]
```

### 5. Delete Image (Admin Only)
```http
DELETE http://localhost:3000/uploads/{imageId}
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Response:**
```json
{
  "message": "Image deleted successfully",
  "id": "507f1f77bcf86cd799439011"
}
```

---

## 🚀 Complete Workflow

### Step 1: Upload Images for Product

**Using cURL:**
```bash
curl -X POST http://localhost:3000/uploads/images \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -F "files=@/path/to/image1.jpg" \
  -F "files=@/path/to/image2.jpg" \
  -F "files=@/path/to/image3.jpg"
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
  },
  {
    "id": "65ba1234567890abcdef0003",
    "url": "http://localhost:3000/uploads/65ba1234567890abcdef0003",
    "filename": "image3.jpg"
  }
]
```

### Step 2: Create Product with Image URLs

```http
POST http://localhost:3000/products
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "name": "Premium Wireless Headphones",
  "description": "High-quality wireless headphones with noise cancellation",
  "price": 199.99,
  "stock": 50,
  "category": "Electronics",
  "brand": "AudioTech",
  "images": [
    "http://localhost:3000/uploads/65ba1234567890abcdef0001",
    "http://localhost:3000/uploads/65ba1234567890abcdef0002",
    "http://localhost:3000/uploads/65ba1234567890abcdef0003"
  ]
}
```

### Step 3: Get Product with Images

```http
GET http://localhost:3000/products/{productId}
```

**Response:**
```json
{
  "_id": "65ba1234567890abcdef1234",
  "name": "Premium Wireless Headphones",
  "description": "High-quality wireless headphones with noise cancellation",
  "price": 199.99,
  "stock": 50,
  "category": "Electronics",
  "brand": "AudioTech",
  "images": [
    "http://localhost:3000/uploads/65ba1234567890abcdef0001",
    "http://localhost:3000/uploads/65ba1234567890abcdef0002",
    "http://localhost:3000/uploads/65ba1234567890abcdef0003"
  ],
  "rating": 0,
  "reviewCount": 0,
  "isActive": true,
  "createdAt": "2024-01-31T12:00:00.000Z",
  "updatedAt": "2024-01-31T12:00:00.000Z"
}
```

### Step 4: Display Images in Frontend

**HTML:**
```html
<img src="http://localhost:3000/uploads/65ba1234567890abcdef0001" alt="Product Image" />
```

**React:**
```jsx
<img 
  src={product.images[0]} 
  alt={product.name}
  style={{ width: '300px', height: 'auto' }}
/>
```

**Vue:**
```vue
<img :src="product.images[0]" :alt="product.name" />
```

---

## 🧪 Testing with Swagger UI

1. **Go to:** http://localhost:3000/api

2. **Authorize with Admin Token:**
   - Click "Authorize" button
   - Enter: `Bearer YOUR_ADMIN_TOKEN`

3. **Upload Image:**
   - Find `POST /uploads/image` endpoint
   - Click "Try it out"
   - Click "Choose File" and select an image
   - Click "Execute"
   - Copy the returned URL

4. **View Image:**
   - Open the URL in browser: `http://localhost:3000/uploads/{imageId}`
   - Image should display!

---

## 🧪 Testing with Postman

### Upload Single Image

1. **Create new request:**
   - Method: `POST`
   - URL: `http://localhost:3000/uploads/image`

2. **Headers:**
   - `Authorization`: `Bearer YOUR_ADMIN_TOKEN`

3. **Body:**
   - Select `form-data`
   - Key: `file` (change type to `File`)
   - Value: Select your image file

4. **Send** and copy the returned URL

### Upload Multiple Images

1. **Create new request:**
   - Method: `POST`
   - URL: `http://localhost:3000/uploads/images`

2. **Headers:**
   - `Authorization`: `Bearer YOUR_ADMIN_TOKEN`

3. **Body:**
   - Select `form-data`
   - Key: `files` (change type to `File`)
   - Click "Select Files" and choose multiple images

4. **Send** and copy the returned URLs

---

## 💻 Testing with JavaScript/Fetch

### Upload Single Image

```javascript
const uploadImage = async (file, token) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('http://localhost:3000/uploads/image', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  const data = await response.json();
  console.log('Uploaded:', data);
  return data.url;
};

// Usage
const fileInput = document.getElementById('fileInput');
const file = fileInput.files[0];
const imageUrl = await uploadImage(file, 'YOUR_ADMIN_TOKEN');
```

### Upload Multiple Images

```javascript
const uploadMultipleImages = async (files, token) => {
  const formData = new FormData();
  
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }

  const response = await fetch('http://localhost:3000/uploads/images', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  const data = await response.json();
  console.log('Uploaded:', data);
  return data.map(img => img.url);
};

// Usage
const fileInput = document.getElementById('fileInput');
const files = fileInput.files;
const imageUrls = await uploadMultipleImages(files, 'YOUR_ADMIN_TOKEN');
```

---

## 🎨 Frontend Integration Examples

### React Component

```jsx
import React, { useState } from 'react';

function ImageUploader({ token }) {
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    setUploading(true);
    const formData = new FormData();
    
    for (let file of files) {
      formData.append('files', file);
    }

    try {
      const response = await fetch('http://localhost:3000/uploads/images', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      setImageUrls(data.map(img => img.url));
      alert('Images uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        multiple 
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
      
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        {imageUrls.map((url, index) => (
          <img 
            key={index}
            src={url} 
            alt={`Upload ${index + 1}`}
            style={{ width: '200px', height: '200px', objectFit: 'cover' }}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageUploader;
```

---

## 📝 File Specifications

### Supported Formats
- ✅ JPEG (.jpg, .jpeg)
- ✅ PNG (.png)
- ✅ GIF (.gif)
- ✅ WebP (.webp)

### File Size Limits
- **Single Image:** 5MB maximum
- **Multiple Images:** 5MB per image, up to 10 images

### Storage
- Images stored in MongoDB GridFS
- Efficient streaming for large files
- Automatic chunking for files > 255KB

---

## 🔒 Security

- ✅ Admin-only upload and delete
- ✅ Public read access (for displaying images)
- ✅ File type validation
- ✅ File size limits
- ✅ Secure file storage in database

---

## 🚀 Production Considerations

### 1. Update BASE_URL in Production
```env
BASE_URL=https://yourdomain.com
```

### 2. Consider CDN for Better Performance
- Upload to MongoDB
- Sync to CDN (Cloudinary, AWS S3, etc.)
- Serve from CDN in production

### 3. Optimize Images
- Compress images before upload
- Use WebP format for better compression
- Generate thumbnails for listings

### 4. Backup Strategy
- Regular MongoDB backups include GridFS
- Consider separate image backup strategy

---

## 🐛 Troubleshooting

### Error: "Only image files are allowed"
- Ensure file is jpg, jpeg, png, gif, or webp
- Check file extension

### Error: "File too large"
- Maximum 5MB per image
- Compress image before upload

### Error: "No file uploaded"
- Ensure form field name is `file` (single) or `files` (multiple)
- Check Content-Type is `multipart/form-data`

### Error: "Forbidden"
- Ensure you're logged in as admin
- Check Authorization header format: `Bearer TOKEN`

### Image not displaying
- Check URL format: `http://localhost:3000/uploads/{imageId}`
- Verify image ID is correct
- Check browser console for errors

---

## ✅ Complete Test Checklist

- [ ] Upload single image as admin
- [ ] Upload multiple images as admin
- [ ] Get uploaded image URL
- [ ] View image in browser
- [ ] Create product with image URLs
- [ ] View product with images
- [ ] List all uploaded images
- [ ] Delete image as admin
- [ ] Verify customer cannot upload images (403)
- [ ] Verify public can view images

---

## 🎉 You're Ready!

Your image upload system is complete and production-ready! Images are stored securely in MongoDB and can be accessed via direct URLs.

**Next Steps:**
1. Upload some test images
2. Create products with those images
3. Display images in your frontend
4. Enjoy your complete e-commerce system! 🚀
