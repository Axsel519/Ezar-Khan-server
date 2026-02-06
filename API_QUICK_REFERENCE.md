# API Quick Reference Card 📋

## Base URL
```
http://localhost:3000
```

## Authentication
```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

---

## 🔐 Authentication

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | Public | Register new user |
| POST | `/auth/login` | Public | Login & get token |

---

## 📦 Products

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/products` | Public | List products (paginated) |
| GET | `/products?search=term` | Public | Search products |
| GET | `/products/:id` | Public | Get product details |
| POST | `/products` | Admin | Create product |
| PATCH | `/products/:id` | Admin | Update product |
| DELETE | `/products/:id` | Admin | Delete product |

---

## 🛒 Orders

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/orders` | Auth | Create order |
| GET | `/orders/my-orders` | Auth | Get my orders |
| GET | `/orders` | Admin | Get all orders (paginated) |
| GET | `/orders/:id` | Auth | Get order details |
| PATCH | `/orders/:id/status` | Admin | Update order status |

---

## 💬 Comments/Reviews

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/comments` | Auth | Create review |
| GET | `/comments/product/:id` | Public | Get product reviews |
| PATCH | `/comments/:id` | Auth | Update own review |
| DELETE | `/comments/:id` | Auth | Delete own review |

---

## 📸 Image Uploads

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/uploads/image` | Admin | Upload single image |
| POST | `/uploads/images` | Admin | Upload multiple images |
| GET | `/uploads/:id` | Public | Get/stream image |
| GET | `/uploads` | Admin | List all images |
| DELETE | `/uploads/:id` | Admin | Delete image |

---

## 🏥 System

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/health` | Public | Health check |
| GET | `/` | Public | API info |
| GET | `/api` | Public | Swagger docs |

---

## 📊 Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Server Error |

---

## 🎯 Order Status Values

- `PENDING` - Order placed
- `PROCESSING` - Being prepared
- `SHIPPED` - Shipped
- `DELIVERED` - Delivered
- `CANCELLED` - Cancelled

---

## 👥 User Roles

- `CUSTOMER` - Regular user
- `ADMIN` - Administrator

---

## 📝 Quick Examples

### Login
```javascript
POST /auth/login
{
  "email": "admin@example.com",
  "password": "Admin@123456"
}
```

### Create Product
```javascript
POST /products
Authorization: Bearer {token}
{
  "name": "Product Name",
  "description": "Description",
  "price": 99.99,
  "stock": 50,
  "images": ["url1", "url2"]
}
```

### Create Order
```javascript
POST /orders
Authorization: Bearer {token}
{
  "items": [
    {"productId": "id", "quantity": 2}
  ],
  "shippingAddress": "123 Main St",
  "phone": "+1234567890"
}
```

### Upload Images
```javascript
POST /uploads/images
Authorization: Bearer {token}
Content-Type: multipart/form-data
Form: files=[file1, file2]
```

---

## 🔑 Test Credentials

**Admin:**
- Email: `admin@example.com`
- Password: `Admin@123456`

**Customer:**
- Email: `john@example.com`
- Password: `Customer@123`

---

## 📚 Full Documentation

- **FRONTEND_API_DOCUMENTATION.md** - Complete API docs
- **Swagger UI** - http://localhost:3000/api
- **IMAGE_UPLOAD_GUIDE.md** - Image upload details
- **TEST_ROUTES.md** - Testing examples

---

**Need help? Check the full documentation!** 🚀
