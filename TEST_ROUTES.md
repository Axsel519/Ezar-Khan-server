# Complete API Testing Routes

## 🚀 Quick Test Sequence

### Step 1: Health Check
```bash
GET http://localhost:3000/health
```

### Step 2: Seed Database
```bash
npm run seed
```

---

## 📋 All Routes with Examples

### 1️⃣ AUTHENTICATION

#### Register New User
```http
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "email": "testuser@example.com",
  "password": "Test@123456",
  "firstName": "Test",
  "lastName": "User",
  "phone": "+1234567890",
  "address": "123 Test Street, Test City"
}
```

#### Login (Get Token)
```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "Admin@123456"
}
```
**Save the `access_token` from response!**

---

### 2️⃣ PRODUCTS

#### Get All Products (Public)
```http
GET http://localhost:3000/products
```

#### Get Products with Pagination
```http
GET http://localhost:3000/products?page=1&limit=5
```

#### Search Products
```http
GET http://localhost:3000/products?search=wireless
```

#### Get Single Product
```http
GET http://localhost:3000/products/{productId}
```
Replace `{productId}` with actual ID from products list

#### Create Product (Admin Only)
```http
POST http://localhost:3000/products
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN

{
  "name": "Premium Wireless Earbuds Pro",
  "description": "High-quality wireless earbuds with active noise cancellation, 40-hour battery life, and crystal clear sound quality. Perfect for music lovers and professionals.",
  "price": 149.99,
  "stock": 75,
  "category": "Electronics",
  "brand": "AudioPro",
  "images": [
    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df",
    "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7"
  ]
}
```

#### Update Product (Admin Only)
```http
PATCH http://localhost:3000/products/{productId}
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN

{
  "price": 129.99,
  "stock": 100,
  "isActive": true
}
```

#### Delete Product (Admin Only)
```http
DELETE http://localhost:3000/products/{productId}
Authorization: Bearer YOUR_ADMIN_TOKEN
```

---

### 3️⃣ ORDERS

#### Create Order (Authenticated)
```http
POST http://localhost:3000/orders
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "items": [
    {
      "productId": "PRODUCT_ID_1",
      "quantity": 2
    },
    {
      "productId": "PRODUCT_ID_2",
      "quantity": 1
    }
  ],
  "shippingAddress": "456 Delivery Ave, Shipping City, State 12345",
  "phone": "+1987654321",
  "notes": "Please ring doorbell twice. Leave at front door if no answer."
}
```
Replace `PRODUCT_ID_1` and `PRODUCT_ID_2` with actual product IDs

#### Get My Orders
```http
GET http://localhost:3000/orders/my-orders
Authorization: Bearer YOUR_TOKEN
```

#### Get All Orders (Admin Only)
```http
GET http://localhost:3000/orders
Authorization: Bearer YOUR_ADMIN_TOKEN
```

#### Get All Orders with Pagination (Admin Only)
```http
GET http://localhost:3000/orders?page=1&limit=10
Authorization: Bearer YOUR_ADMIN_TOKEN
```

#### Get Single Order
```http
GET http://localhost:3000/orders/{orderId}
Authorization: Bearer YOUR_TOKEN
```

#### Update Order Status (Admin Only)
```http
PATCH http://localhost:3000/orders/{orderId}/status
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN

{
  "status": "PROCESSING"
}
```
**Valid status values:** `PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`

---

### 4️⃣ COMMENTS & REVIEWS

#### Create Product Review (Authenticated)
```http
POST http://localhost:3000/comments
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "productId": "PRODUCT_ID",
  "content": "Absolutely amazing product! The quality exceeded my expectations. Highly recommend to anyone looking for a reliable and high-performance device.",
  "rating": 5
}
```
**Rating:** 1-5 (integer)

#### Get Product Reviews (Public)
```http
GET http://localhost:3000/comments/product/{productId}
```

#### Update Review (Own Reviews Only)
```http
PATCH http://localhost:3000/comments/{commentId}
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "content": "Updated review: Still great after 3 months of use!",
  "rating": 5
}
```

#### Delete Review (Own Reviews Only)
```http
DELETE http://localhost:3000/comments/{commentId}
Authorization: Bearer YOUR_TOKEN
```

---

### 5️⃣ SYSTEM ENDPOINTS

#### Health Check
```http
GET http://localhost:3000/health
```

#### API Info
```http
GET http://localhost:3000
```

#### Swagger Documentation
```
Open in browser: http://localhost:3000/api
```

---

## 📸 IMAGE UPLOADS

### Upload Single Image (Admin Only)
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

### Upload Multiple Images (Admin Only)
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
    "filename": "image1.jpg"
  },
  {
    "id": "507f1f77bcf86cd799439012",
    "url": "http://localhost:3000/uploads/507f1f77bcf86cd799439012",
    "filename": "image2.jpg"
  }
]
```

### Get Image (Public)
```http
GET http://localhost:3000/uploads/{imageId}
```

### List All Images (Admin Only)
```http
GET http://localhost:3000/uploads
Authorization: Bearer YOUR_ADMIN_TOKEN
```

### Delete Image (Admin Only)
```http
DELETE http://localhost:3000/uploads/{imageId}
Authorization: Bearer YOUR_ADMIN_TOKEN
```

---

### 6️⃣ SYSTEM ENDPOINTS

#### Health Check
```http
GET http://localhost:3000/health
```

#### API Info
```http
GET http://localhost:3000
```

#### Swagger Documentation
```
Open in browser: http://localhost:3000/api
```

---

## 🧪 Complete Test Flow

### Test Scenario 1: Customer Journey

```bash
# 1. Register new customer
POST /auth/register
Body: {
  "email": "customer@test.com",
  "password": "Customer@123",
  "firstName": "John",
  "lastName": "Customer"
}

# 2. Login
POST /auth/login
Body: {
  "email": "customer@test.com",
  "password": "Customer@123"
}
# Save token!

# 3. Browse products
GET /products

# 4. View product details
GET /products/{productId}

# 5. Create order
POST /orders
Authorization: Bearer {token}
Body: {
  "items": [{"productId": "...", "quantity": 2}],
  "shippingAddress": "123 Main St",
  "phone": "+1234567890"
}

# 6. View my orders
GET /orders/my-orders
Authorization: Bearer {token}

# 7. Leave review
POST /comments
Authorization: Bearer {token}
Body: {
  "productId": "...",
  "content": "Great product!",
  "rating": 5
}
```

### Test Scenario 2: Admin Workflow

```bash
# 1. Login as admin
POST /auth/login
Body: {
  "email": "admin@example.com",
  "password": "Admin@123456"
}
# Save admin token!

# 2. Create new product
POST /products
Authorization: Bearer {admin_token}
Body: {
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "stock": 50,
  "category": "Electronics"
}

# 3. View all orders
GET /orders
Authorization: Bearer {admin_token}

# 4. Update order status
PATCH /orders/{orderId}/status
Authorization: Bearer {admin_token}
Body: {
  "status": "SHIPPED"
}

# 5. Update product
PATCH /products/{productId}
Authorization: Bearer {admin_token}
Body: {
  "price": 89.99,
  "stock": 75
}
```

---

## 📝 cURL Commands (Copy & Paste)

### Register
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123456",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin@123456"
  }'
```

### Get Products
```bash
curl http://localhost:3000/products
```

### Create Product (Replace TOKEN)
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Test Product",
    "description": "Test description",
    "price": 99.99,
    "stock": 50,
    "category": "Electronics"
  }'
```

### Create Order (Replace TOKEN and PRODUCT_ID)
```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "items": [{"productId": "PRODUCT_ID", "quantity": 1}],
    "shippingAddress": "123 Test St",
    "phone": "+1234567890"
  }'
```

### Create Review (Replace TOKEN and PRODUCT_ID)
```bash
curl -X POST http://localhost:3000/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "productId": "PRODUCT_ID",
    "content": "Great product!",
    "rating": 5
  }'
```

---

## 🎯 Quick Test Checklist

- [ ] Health check works
- [ ] Can register new user
- [ ] Can login and get token
- [ ] Can view products (public)
- [ ] Can search products
- [ ] Admin can create product
- [ ] Customer cannot create product (403)
- [ ] Can create order with valid products
- [ ] Stock decreases after order
- [ ] Can view my orders
- [ ] Admin can view all orders
- [ ] Admin can update order status
- [ ] Can create product review
- [ ] Product rating updates after review
- [ ] Can update own review
- [ ] Cannot update others' reviews (403)
- [ ] Can delete own review
- [ ] Cannot delete others' reviews (403)

---

## 🔑 Test Credentials (After Seeding)

**Admin:**
- Email: `admin@example.com`
- Password: `Admin@123456`

**Customers:**
- Email: `john@example.com` | Password: `Customer@123`
- Email: `jane@example.com` | Password: `Customer@123`

---

## 💡 Tips

1. **Use Swagger UI** at http://localhost:3000/api for easiest testing
2. **Save tokens** after login for subsequent requests
3. **Get product IDs** from GET /products before creating orders
4. **Test as both** admin and customer to verify permissions
5. **Check MongoDB** to verify data is saved correctly

---

## 🚨 Expected Errors (For Testing)

### 401 Unauthorized
```http
GET http://localhost:3000/orders/my-orders
# Without Authorization header
```

### 403 Forbidden
```http
POST http://localhost:3000/products
Authorization: Bearer CUSTOMER_TOKEN
# Customer trying to create product
```

### 400 Bad Request
```http
POST http://localhost:3000/orders
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "items": [{"productId": "invalid-id", "quantity": 1}],
  "shippingAddress": "123 Test St"
}
```

### 404 Not Found
```http
GET http://localhost:3000/products/507f1f77bcf86cd799439011
# Non-existent product ID
```

---

## ✅ Success!

If all routes work as expected, your API is **100% ready for production!** 🎉

For interactive testing, use Swagger UI: **http://localhost:3000/api**
