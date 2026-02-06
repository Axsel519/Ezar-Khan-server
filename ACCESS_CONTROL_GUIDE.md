# Access Control Guide 🔒

## Overview

The API has three access levels:
1. **Public** - No authentication required
2. **Authenticated** - Login required (Customer or Admin)
3. **Admin Only** - Admin role required

---

## 🌍 Public Routes (No Login Required)

### Products
- ✅ `GET /products` - Browse all products
- ✅ `GET /products?search=term` - Search products
- ✅ `GET /products/:id` - View product details

### Reviews
- ✅ `GET /comments/product/:id` - View product reviews

### Images
- ✅ `GET /uploads/:id` - View product images

### Authentication
- ✅ `POST /auth/register` - Register new account
- ✅ `POST /auth/login` - Login

### System
- ✅ `GET /health` - Health check
- ✅ `GET /` - API info
- ✅ `GET /api` - Swagger documentation

**Use Case:** Customers can browse your store, view products, read reviews, and see images without creating an account!

---

## 🔐 Authenticated Routes (Login Required)

### Orders
- 🔒 `POST /orders` - Create order
- 🔒 `GET /orders/my-orders` - View my orders
- 🔒 `GET /orders/:id` - View order details

### Reviews
- 🔒 `POST /comments` - Create product review
- 🔒 `PATCH /comments/:id` - Update own review
- 🔒 `DELETE /comments/:id` - Delete own review

**Use Case:** Customers must login to place orders and leave reviews.

**How to Authenticate:**
```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

---

## 👑 Admin Only Routes

### Product Management
- 👑 `POST /products` - Create product
- 👑 `PATCH /products/:id` - Update product
- 👑 `DELETE /products/:id` - Delete product

### Order Management
- 👑 `GET /orders` - View all orders (paginated)
- 👑 `PATCH /orders/:id/status` - Update order status

### Image Management
- 👑 `POST /uploads/image` - Upload single image
- 👑 `POST /uploads/images` - Upload multiple images
- 👑 `GET /uploads` - List all uploaded images
- 👑 `DELETE /uploads/:id` - Delete image

**Use Case:** Only admins can manage products, orders, and images.

**Requirements:**
- Must be logged in
- User role must be `ADMIN`

---

## 🎯 Customer Journey (No Login)

```
1. Browse products → GET /products
2. Search products → GET /products?search=wireless
3. View product details → GET /products/:id
4. Read reviews → GET /comments/product/:id
5. View product images → GET /uploads/:id
```

**No authentication required!** ✅

---

## 🎯 Customer Journey (With Login)

```
1. Register → POST /auth/register
2. Login → POST /auth/login (get token)
3. Browse products → GET /products
4. Create order → POST /orders (with token)
5. View my orders → GET /orders/my-orders (with token)
6. Leave review → POST /comments (with token)
```

---

## 🎯 Admin Journey

```
1. Login as admin → POST /auth/login
2. Upload images → POST /uploads/images (with admin token)
3. Create product → POST /products (with admin token)
4. View all orders → GET /orders (with admin token)
5. Update order status → PATCH /orders/:id/status (with admin token)
6. Update product → PATCH /products/:id (with admin token)
```

---

## 🔑 Authentication Flow

### 1. Register (Optional)
```javascript
POST /auth/register
{
  "email": "user@example.com",
  "password": "Password@123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### 2. Login
```javascript
POST /auth/login
{
  "email": "user@example.com",
  "password": "Password@123"
}

// Response
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "email": "user@example.com",
    "role": "CUSTOMER"
  }
}
```

### 3. Store Token
```javascript
localStorage.setItem('token', response.access_token);
```

### 4. Use Token
```javascript
fetch('http://localhost:3000/orders', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

---

## 🚫 Error Responses

### 401 Unauthorized (No Token)
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**Solution:** Include valid token in Authorization header

### 403 Forbidden (Not Admin)
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

**Solution:** Login with admin account

---

## 💡 Frontend Implementation Tips

### Check Authentication Status
```javascript
const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

const isAdmin = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.role === 'ADMIN';
};
```

### Conditional Rendering
```jsx
// Show login button if not authenticated
{!isAuthenticated() && (
  <button onClick={handleLogin}>Login</button>
)}

// Show admin features only for admins
{isAdmin() && (
  <button onClick={handleCreateProduct}>Create Product</button>
)}

// Anyone can browse products
<ProductList />
```

### Protected Routes (React Router)
```jsx
// Public route - anyone can access
<Route path="/products" element={<ProductList />} />

// Protected route - login required
<Route 
  path="/orders" 
  element={
    isAuthenticated() ? <MyOrders /> : <Navigate to="/login" />
  } 
/>

// Admin route - admin only
<Route 
  path="/admin" 
  element={
    isAdmin() ? <AdminDashboard /> : <Navigate to="/" />
  } 
/>
```

---

## 📊 Access Control Matrix

| Route | Public | Customer | Admin |
|-------|--------|----------|-------|
| Browse Products | ✅ | ✅ | ✅ |
| View Product | ✅ | ✅ | ✅ |
| View Reviews | ✅ | ✅ | ✅ |
| View Images | ✅ | ✅ | ✅ |
| Register | ✅ | ✅ | ✅ |
| Login | ✅ | ✅ | ✅ |
| Create Order | ❌ | ✅ | ✅ |
| View My Orders | ❌ | ✅ | ✅ |
| Create Review | ❌ | ✅ | ✅ |
| Create Product | ❌ | ❌ | ✅ |
| Update Product | ❌ | ❌ | ✅ |
| Delete Product | ❌ | ❌ | ✅ |
| View All Orders | ❌ | ❌ | ✅ |
| Update Order Status | ❌ | ❌ | ✅ |
| Upload Images | ❌ | ❌ | ✅ |

---

## 🎯 Best Practices

### For Public Routes
- ✅ No authentication required
- ✅ Cache responses for better performance
- ✅ Implement pagination for large lists
- ✅ Add search and filters

### For Authenticated Routes
- ✅ Always check token validity
- ✅ Handle token expiration gracefully
- ✅ Redirect to login if unauthorized
- ✅ Store token securely

### For Admin Routes
- ✅ Verify admin role on frontend
- ✅ Hide admin features from non-admins
- ✅ Double-check permissions before actions
- ✅ Backend validates all requests

---

## 🔒 Security Notes

1. **Frontend validation is not security** - Backend always validates
2. **Tokens expire after 7 days** - Handle expiration
3. **Never store passwords** - Only store tokens
4. **Use HTTPS in production** - Protect tokens in transit
5. **Validate user role** - Check both frontend and backend

---

## 📝 Summary

**Public Access:**
- Browse products ✅
- View details ✅
- Read reviews ✅
- See images ✅

**Login Required:**
- Place orders 🔒
- Leave reviews 🔒
- View order history 🔒

**Admin Only:**
- Manage products 👑
- Manage orders 👑
- Upload images 👑

**Perfect for e-commerce!** Customers can browse freely, but must login to purchase. Admins have full control. 🚀
