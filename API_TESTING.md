# API Testing Guide

Complete guide for testing all API endpoints.

## 🚀 Getting Started

1. Start the server: `npm run start:dev`
2. Seed the database: `npm run seed`
3. Use the credentials below or Swagger UI at http://localhost:3000/api

## 🔑 Test Credentials

After running `npm run seed`:

**Admin User:**
- Email: `admin@example.com`
- Password: `Admin@123456`

**Customer Users:**
- Email: `john@example.com` / Password: `Customer@123`
- Email: `jane@example.com` / Password: `Customer@123`

## 📋 Testing Workflow

### 1. Authentication Flow

#### Register New User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "Test@123456",
    "firstName": "New",
    "lastName": "User",
    "phone": "+1234567890",
    "address": "123 Test St"
  }'
```

**Expected Response (201):**
```json
{
  "email": "newuser@example.com",
  "firstName": "New",
  "lastName": "User",
  "role": "CUSTOMER",
  "phone": "+1234567890",
  "address": "123 Test St",
  "_id": "...",
  "createdAt": "...",
  "updatedAt": "..."
}
```

#### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin@123456"
  }'
```

**Expected Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "email": "admin@example.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN"
  }
}
```

**Save the `access_token` for subsequent requests!**

### 2. Product Management

#### Get All Products (Public)
```bash
curl http://localhost:3000/products
```

#### Get Products with Pagination
```bash
curl "http://localhost:3000/products?page=1&limit=5"
```

#### Search Products
```bash
curl "http://localhost:3000/products?search=wireless"
```

#### Get Single Product
```bash
curl http://localhost:3000/products/{productId}
```

#### Create Product (Admin Only)
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "New Wireless Earbuds",
    "description": "High-quality wireless earbuds with noise cancellation",
    "price": 79.99,
    "stock": 100,
    "category": "Electronics",
    "brand": "AudioTech",
    "images": ["https://example.com/image.jpg"]
  }'
```

**Expected Response (201):**
```json
{
  "name": "New Wireless Earbuds",
  "description": "High-quality wireless earbuds with noise cancellation",
  "price": 79.99,
  "stock": 100,
  "category": "Electronics",
  "brand": "AudioTech",
  "images": ["https://example.com/image.jpg"],
  "rating": 0,
  "reviewCount": 0,
  "isActive": true,
  "_id": "...",
  "createdAt": "...",
  "updatedAt": "..."
}
```

#### Update Product (Admin Only)
```bash
curl -X PATCH http://localhost:3000/products/{productId} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "price": 69.99,
    "stock": 150
  }'
```

#### Delete Product (Admin Only)
```bash
curl -X DELETE http://localhost:3000/products/{productId} \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 3. Order Management

#### Create Order (Authenticated)
```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
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
    "shippingAddress": "123 Main St, City, State 12345",
    "phone": "+1234567890",
    "notes": "Please deliver before 5 PM"
  }'
```

**Expected Response (201):**
```json
{
  "userId": "...",
  "items": [
    {
      "productId": "...",
      "productName": "Wireless Bluetooth Headphones",
      "quantity": 2,
      "price": 199.99
    }
  ],
  "totalAmount": 399.98,
  "status": "PENDING",
  "shippingAddress": "123 Main St, City, State 12345",
  "phone": "+1234567890",
  "notes": "Please deliver before 5 PM",
  "_id": "...",
  "createdAt": "...",
  "updatedAt": "..."
}
```

#### Get My Orders
```bash
curl http://localhost:3000/orders/my-orders \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Get All Orders (Admin Only)
```bash
curl "http://localhost:3000/orders?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

#### Get Single Order
```bash
curl http://localhost:3000/orders/{orderId} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Update Order Status (Admin Only)
```bash
curl -X PATCH http://localhost:3000/orders/{orderId}/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "status": "PROCESSING"
  }'
```

**Valid Status Values:**
- `PENDING`
- `PROCESSING`
- `SHIPPED`
- `DELIVERED`
- `CANCELLED`

### 4. Comments & Reviews

#### Create Comment/Review (Authenticated)
```bash
curl -X POST http://localhost:3000/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "productId": "PRODUCT_ID",
    "content": "Great product! Highly recommended.",
    "rating": 5
  }'
```

**Expected Response (201):**
```json
{
  "userId": "...",
  "productId": "...",
  "content": "Great product! Highly recommended.",
  "rating": 5,
  "_id": "...",
  "createdAt": "...",
  "updatedAt": "..."
}
```

#### Get Product Comments
```bash
curl http://localhost:3000/comments/product/{productId}
```

#### Update Comment (Own Comments Only)
```bash
curl -X PATCH http://localhost:3000/comments/{commentId} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "content": "Updated review content",
    "rating": 4
  }'
```

#### Delete Comment (Own Comments Only)
```bash
curl -X DELETE http://localhost:3000/comments/{commentId} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. System Endpoints

#### Health Check
```bash
curl http://localhost:3000/health
```

**Expected Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2024-01-31T12:00:00.000Z",
  "uptime": 3600.5,
  "environment": "development"
}
```

#### API Info
```bash
curl http://localhost:3000
```

## 🧪 Testing Scenarios

### Scenario 1: Complete Customer Journey

1. **Register** as new customer
2. **Login** to get token
3. **Browse products** (GET /products)
4. **View product details** (GET /products/:id)
5. **Create order** with multiple items
6. **View order history** (GET /orders/my-orders)
7. **Leave review** on purchased product

### Scenario 2: Admin Workflow

1. **Login** as admin
2. **Create new product**
3. **View all orders**
4. **Update order status** to PROCESSING
5. **Update order status** to SHIPPED
6. **Update product** stock levels

### Scenario 3: Error Handling

#### Invalid Credentials
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "wrong@example.com",
    "password": "wrongpassword"
  }'
```
**Expected: 401 Unauthorized**

#### Unauthorized Access
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Test"}'
```
**Expected: 401 Unauthorized (no token)**

#### Insufficient Permissions
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer CUSTOMER_TOKEN" \
  -d '{"name": "Test"}'
```
**Expected: 403 Forbidden (customer trying to create product)**

#### Invalid Product ID
```bash
curl http://localhost:3000/products/invalid-id
```
**Expected: 400 Bad Request**

#### Product Not Found
```bash
curl http://localhost:3000/products/507f1f77bcf86cd799439011
```
**Expected: 404 Not Found**

#### Insufficient Stock
```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "items": [{"productId": "PRODUCT_ID", "quantity": 99999}],
    "shippingAddress": "123 Test St"
  }'
```
**Expected: 400 Bad Request (insufficient stock)**

## 📊 Response Status Codes

- `200 OK` - Successful GET/PATCH request
- `201 Created` - Successful POST request
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate resource (e.g., email exists)
- `500 Internal Server Error` - Server error

## 🔍 Common Headers

### Authentication
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Content Type
```
Content-Type: application/json
```

## 🛠️ Tools for Testing

### 1. Swagger UI (Recommended)
- URL: http://localhost:3000/api
- Interactive testing
- Built-in authentication
- Request/response examples

### 2. cURL
- Command-line testing
- Scriptable
- Examples provided above

### 3. Postman
- Import OpenAPI spec from http://localhost:3000/api-json
- Visual interface
- Collection organization
- Environment variables

### 4. HTTPie
```bash
# Install
pip install httpie

# Example usage
http POST localhost:3000/auth/login email=admin@example.com password=Admin@123456
```

### 5. REST Client (VS Code Extension)
Create a `.http` file:
```http
### Login
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "Admin@123456"
}

### Get Products
GET http://localhost:3000/products
```

## 📝 Testing Checklist

- [ ] User registration works
- [ ] User login returns valid JWT
- [ ] JWT authentication works on protected routes
- [ ] Admin can create products
- [ ] Customer cannot create products
- [ ] Products can be searched and filtered
- [ ] Orders can be created with valid products
- [ ] Stock is deducted after order creation
- [ ] Order status can be updated by admin
- [ ] Comments can be created and updated
- [ ] Product rating updates after comments
- [ ] Users can only edit their own comments
- [ ] Invalid IDs return 400 errors
- [ ] Missing resources return 404 errors
- [ ] Unauthorized access returns 401 errors
- [ ] Insufficient permissions return 403 errors
- [ ] Health check endpoint works

## 🐛 Debugging Tips

1. **Check server logs** for detailed error messages
2. **Verify MongoDB is running** before testing
3. **Use correct token** for authenticated requests
4. **Check token expiration** (default: 7 days)
5. **Validate JSON syntax** in request bodies
6. **Use correct ObjectId format** for MongoDB IDs
7. **Ensure products have stock** before creating orders

## 📞 Support

If you encounter issues:
1. Check the server logs
2. Verify environment variables
3. Ensure MongoDB is running
4. Review the API documentation at /api
5. Check this testing guide

Happy Testing! 🚀
