# Frontend API Documentation 🚀

Complete API reference for frontend developers building customer and admin dashboards.

## 📋 Table of Contents

1. [Base Configuration](#base-configuration)
2. [Authentication](#authentication)
3. [Customer Routes](#customer-routes)
4. [Admin Routes](#admin-routes)
5. [Public Routes](#public-routes)
6. [Error Handling](#error-handling)
7. [TypeScript Types](#typescript-types)

---

## Base Configuration

```javascript
const API_BASE_URL = 'http://localhost:3000';

// For production
// const API_BASE_URL = 'https://your-domain.com';
```

### Authentication Header
```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

---

## Authentication

### 1. Register User (Public)

**Endpoint:** `POST /auth/register`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "Password@123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "address": "123 Main St, City, State 12345"
}
```

**Response (201):**
```json
{
  "_id": "65ba1234567890abcdef1234",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "CUSTOMER",
  "phone": "+1234567890",
  "address": "123 Main St, City, State 12345",
  "createdAt": "2024-01-31T12:00:00.000Z",
  "updatedAt": "2024-01-31T12:00:00.000Z"
}
```

**Validation Rules:**
- Email: Valid email format, unique
- Password: Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
- firstName: Required
- lastName: Required
- phone: Optional
- address: Optional

---

### 2. Login (Public)

**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "Password@123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65ba1234567890abcdef1234",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CUSTOMER"
  }
}
```

**Store Token:**
```javascript
localStorage.setItem('token', response.access_token);
localStorage.setItem('user', JSON.stringify(response.user));
```

---

## Customer Routes

### 1. Browse Products (Public)

**Endpoint:** `GET /products`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term

**Examples:**
```
GET /products
GET /products?page=2&limit=20
GET /products?search=wireless
GET /products?page=1&limit=10&search=headphones
```

**Response (200):**
```json
{
  "data": [
    {
      "_id": "65ba1234567890abcdef1234",
      "name": "Wireless Bluetooth Headphones",
      "description": "Premium wireless headphones...",
      "price": 199.99,
      "stock": 50,
      "images": [
        "http://localhost:3000/uploads/65ba1234567890abcdef0001",
        "http://localhost:3000/uploads/65ba1234567890abcdef0002"
      ],
      "rating": 4.5,
      "reviewCount": 128,
      "isActive": true,
      "category": "Electronics",
      "brand": "AudioTech",
      "createdAt": "2024-01-31T12:00:00.000Z",
      "updatedAt": "2024-01-31T12:00:00.000Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

---

### 2. Get Product Details (Public)

**Endpoint:** `GET /products/:id`

**Response (200):**
```json
{
  "_id": "65ba1234567890abcdef1234",
  "name": "Wireless Bluetooth Headphones",
  "description": "Premium wireless headphones with active noise cancellation...",
  "price": 199.99,
  "stock": 50,
  "images": [
    "http://localhost:3000/uploads/65ba1234567890abcdef0001"
  ],
  "rating": 4.5,
  "reviewCount": 128,
  "isActive": true,
  "category": "Electronics",
  "brand": "AudioTech",
  "createdAt": "2024-01-31T12:00:00.000Z",
  "updatedAt": "2024-01-31T12:00:00.000Z"
}
```

---

### 3. Create Order (Authenticated)

**Endpoint:** `POST /orders`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "items": [
    {
      "productId": "65ba1234567890abcdef1234",
      "quantity": 2
    },
    {
      "productId": "65ba1234567890abcdef5678",
      "quantity": 1
    }
  ],
  "shippingAddress": "123 Main St, City, State 12345",
  "phone": "+1234567890",
  "notes": "Please deliver before 5 PM"
}
```

**Response (201):**
```json
{
  "_id": "65ba1234567890abcdef9999",
  "userId": "65ba1234567890abcdef1234",
  "items": [
    {
      "productId": "65ba1234567890abcdef1234",
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
  "createdAt": "2024-01-31T12:00:00.000Z",
  "updatedAt": "2024-01-31T12:00:00.000Z"
}
```

**Order Status Values:**
- `PENDING` - Order placed, awaiting processing
- `PROCESSING` - Order being prepared
- `SHIPPED` - Order shipped
- `DELIVERED` - Order delivered
- `CANCELLED` - Order cancelled

---

### 4. Get My Orders (Authenticated)

**Endpoint:** `GET /orders/my-orders`

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
[
  {
    "_id": "65ba1234567890abcdef9999",
    "userId": "65ba1234567890abcdef1234",
    "items": [
      {
        "productId": "65ba1234567890abcdef1234",
        "productName": "Wireless Bluetooth Headphones",
        "quantity": 2,
        "price": 199.99
      }
    ],
    "totalAmount": 399.98,
    "status": "SHIPPED",
    "shippingAddress": "123 Main St, City, State 12345",
    "phone": "+1234567890",
    "createdAt": "2024-01-31T12:00:00.000Z",
    "updatedAt": "2024-01-31T12:00:00.000Z"
  }
]
```

---

### 5. Get Order Details (Authenticated)

**Endpoint:** `GET /orders/:id`

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "_id": "65ba1234567890abcdef9999",
  "userId": {
    "_id": "65ba1234567890abcdef1234",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "items": [
    {
      "productId": "65ba1234567890abcdef1234",
      "productName": "Wireless Bluetooth Headphones",
      "quantity": 2,
      "price": 199.99
    }
  ],
  "totalAmount": 399.98,
  "status": "SHIPPED",
  "shippingAddress": "123 Main St, City, State 12345",
  "phone": "+1234567890",
  "notes": "Please deliver before 5 PM",
  "createdAt": "2024-01-31T12:00:00.000Z",
  "updatedAt": "2024-01-31T12:00:00.000Z"
}
```

---

### 6. Create Product Review (Authenticated)

**Endpoint:** `POST /comments`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "productId": "65ba1234567890abcdef1234",
  "content": "Great product! Highly recommend.",
  "rating": 5
}
```

**Validation:**
- rating: Integer between 1-5
- content: Required, min 10 characters

**Response (201):**
```json
{
  "_id": "65ba1234567890abcdefaaaa",
  "userId": "65ba1234567890abcdef1234",
  "productId": "65ba1234567890abcdef1234",
  "content": "Great product! Highly recommend.",
  "rating": 5,
  "createdAt": "2024-01-31T12:00:00.000Z",
  "updatedAt": "2024-01-31T12:00:00.000Z"
}
```

---

### 7. Get Product Reviews (Public)

**Endpoint:** `GET /comments/product/:productId`

**Response (200):**
```json
[
  {
    "_id": "65ba1234567890abcdefaaaa",
    "userId": {
      "_id": "65ba1234567890abcdef1234",
      "firstName": "John",
      "lastName": "Doe",
      "email": "user@example.com"
    },
    "productId": "65ba1234567890abcdef1234",
    "content": "Great product! Highly recommend.",
    "rating": 5,
    "createdAt": "2024-01-31T12:00:00.000Z",
    "updatedAt": "2024-01-31T12:00:00.000Z"
  }
]
```

---

### 8. Update My Review (Authenticated)

**Endpoint:** `PATCH /comments/:id`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "content": "Updated review content",
  "rating": 4
}
```

**Response (200):**
```json
{
  "_id": "65ba1234567890abcdefaaaa",
  "userId": "65ba1234567890abcdef1234",
  "productId": "65ba1234567890abcdef1234",
  "content": "Updated review content",
  "rating": 4,
  "createdAt": "2024-01-31T12:00:00.000Z",
  "updatedAt": "2024-01-31T13:00:00.000Z"
}
```

---

### 9. Delete My Review (Authenticated)

**Endpoint:** `DELETE /comments/:id`

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "message": "Comment deleted successfully"
}
```

---

## Admin Routes

### 1. Create Product (Admin Only)

**Endpoint:** `POST /products`

**Headers:** `Authorization: Bearer {admin_token}`

**Request:**
```json
{
  "name": "Wireless Bluetooth Headphones",
  "description": "Premium wireless headphones with active noise cancellation",
  "price": 199.99,
  "stock": 50,
  "category": "Electronics",
  "brand": "AudioTech",
  "images": [
    "http://localhost:3000/uploads/65ba1234567890abcdef0001",
    "http://localhost:3000/uploads/65ba1234567890abcdef0002"
  ]
}
```

**Validation:**
- name: Required
- description: Required
- price: Required, positive number
- stock: Required, non-negative integer
- category: Optional
- brand: Optional
- images: Optional, array of URLs

**Response (201):**
```json
{
  "_id": "65ba1234567890abcdef1234",
  "name": "Wireless Bluetooth Headphones",
  "description": "Premium wireless headphones with active noise cancellation",
  "price": 199.99,
  "stock": 50,
  "images": [
    "http://localhost:3000/uploads/65ba1234567890abcdef0001"
  ],
  "rating": 0,
  "reviewCount": 0,
  "isActive": true,
  "category": "Electronics",
  "brand": "AudioTech",
  "createdAt": "2024-01-31T12:00:00.000Z",
  "updatedAt": "2024-01-31T12:00:00.000Z"
}
```

---

### 2. Update Product (Admin Only)

**Endpoint:** `PATCH /products/:id`

**Headers:** `Authorization: Bearer {admin_token}`

**Request (Partial Update):**
```json
{
  "price": 179.99,
  "stock": 75,
  "isActive": true
}
```

**Response (200):**
```json
{
  "_id": "65ba1234567890abcdef1234",
  "name": "Wireless Bluetooth Headphones",
  "description": "Premium wireless headphones with active noise cancellation",
  "price": 179.99,
  "stock": 75,
  "images": [
    "http://localhost:3000/uploads/65ba1234567890abcdef0001"
  ],
  "rating": 4.5,
  "reviewCount": 128,
  "isActive": true,
  "category": "Electronics",
  "brand": "AudioTech",
  "createdAt": "2024-01-31T12:00:00.000Z",
  "updatedAt": "2024-01-31T13:00:00.000Z"
}
```

---

### 3. Delete Product (Admin Only)

**Endpoint:** `DELETE /products/:id`

**Headers:** `Authorization: Bearer {admin_token}`

**Response (200):**
```json
{
  "message": "Product deleted successfully"
}
```

---

### 4. Get All Orders (Admin Only)

**Endpoint:** `GET /orders`

**Headers:** `Authorization: Bearer {admin_token}`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Example:** `GET /orders?page=1&limit=20`

**Response (200):**
```json
{
  "data": [
    {
      "_id": "65ba1234567890abcdef9999",
      "userId": {
        "_id": "65ba1234567890abcdef1234",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe"
      },
      "items": [
        {
          "productId": "65ba1234567890abcdef1234",
          "productName": "Wireless Bluetooth Headphones",
          "quantity": 2,
          "price": 199.99
        }
      ],
      "totalAmount": 399.98,
      "status": "PENDING",
      "shippingAddress": "123 Main St, City, State 12345",
      "phone": "+1234567890",
      "createdAt": "2024-01-31T12:00:00.000Z",
      "updatedAt": "2024-01-31T12:00:00.000Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10
}
```

---

### 5. Update Order Status (Admin Only)

**Endpoint:** `PATCH /orders/:id/status`

**Headers:** `Authorization: Bearer {admin_token}`

**Request:**
```json
{
  "status": "SHIPPED"
}
```

**Valid Status Values:**
- `PENDING`
- `PROCESSING`
- `SHIPPED`
- `DELIVERED`
- `CANCELLED`

**Response (200):**
```json
{
  "_id": "65ba1234567890abcdef9999",
  "userId": {
    "_id": "65ba1234567890abcdef1234",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "items": [...],
  "totalAmount": 399.98,
  "status": "SHIPPED",
  "shippingAddress": "123 Main St, City, State 12345",
  "phone": "+1234567890",
  "createdAt": "2024-01-31T12:00:00.000Z",
  "updatedAt": "2024-01-31T13:00:00.000Z"
}
```

---

### 6. Upload Single Image (Admin Only)

**Endpoint:** `POST /uploads/image`

**Headers:** 
- `Authorization: Bearer {admin_token}`
- `Content-Type: multipart/form-data`

**Form Data:**
- `file`: Image file (jpg, jpeg, png, gif, webp, max 5MB)

**Response (201):**
```json
{
  "id": "65ba1234567890abcdef0001",
  "url": "http://localhost:3000/uploads/65ba1234567890abcdef0001",
  "filename": "product-image.jpg"
}
```

---

### 7. Upload Multiple Images (Admin Only)

**Endpoint:** `POST /uploads/images`

**Headers:** 
- `Authorization: Bearer {admin_token}`
- `Content-Type: multipart/form-data`

**Form Data:**
- `files`: Multiple image files (max 10, each max 5MB)

**Response (201):**
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

---

### 8. List All Images (Admin Only)

**Endpoint:** `GET /uploads`

**Headers:** `Authorization: Bearer {admin_token}`

**Response (200):**
```json
[
  {
    "id": "65ba1234567890abcdef0001",
    "filename": "product-image.jpg",
    "size": 245678,
    "uploadDate": "2024-01-31T12:00:00.000Z"
  }
]
```

---

### 9. Delete Image (Admin Only)

**Endpoint:** `DELETE /uploads/:id`

**Headers:** `Authorization: Bearer {admin_token}`

**Response (200):**
```json
{
  "message": "Image deleted successfully",
  "id": "65ba1234567890abcdef0001"
}
```

---

## Public Routes

### 1. Get Image (Public)

**Endpoint:** `GET /uploads/:id`

**Response:** Image stream (displays image directly)

**Usage in HTML:**
```html
<img src="http://localhost:3000/uploads/65ba1234567890abcdef0001" alt="Product" />
```

---

### 2. Health Check (Public)

**Endpoint:** `GET /health`

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2024-01-31T12:00:00.000Z",
  "uptime": 3600.5,
  "environment": "development"
}
```

---

### 3. API Info (Public)

**Endpoint:** `GET /`

**Response (200):**
```
E-commerce API is running! Visit /api for documentation.
```

---

## Error Handling

### Error Response Format

All errors follow this format:

```json
{
  "statusCode": 400,
  "message": "Error message here",
  "error": "Bad Request"
}
```

### Common Status Codes

| Code | Meaning | When It Happens |
|------|---------|-----------------|
| 200 | OK | Successful GET/PATCH/DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource (e.g., email exists) |
| 500 | Server Error | Internal server error |

### Example Error Responses

**400 Bad Request:**
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 8 characters"
  ],
  "error": "Bad Request"
}
```

**401 Unauthorized:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

**403 Forbidden:**
```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

**404 Not Found:**
```json
{
  "statusCode": 404,
  "message": "Product with ID 65ba1234567890abcdef1234 not found",
  "error": "Not Found"
}
```

**409 Conflict:**
```json
{
  "statusCode": 409,
  "message": "Email already exists",
  "error": "Conflict"
}
```

---

## TypeScript Types

### User Types

```typescript
enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN'
}

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  access_token: string;
  user: User;
}

interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
}

interface LoginDto {
  email: string;
  password: string;
}
```

### Product Types

```typescript
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  category?: string;
  brand?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  stock: number;
  category?: string;
  brand?: string;
  images?: string[];
}

interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
  brand?: string;
  images?: string[];
  isActive?: boolean;
}
```

### Order Types

```typescript
enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  userId: string | User;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
  phone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrdersResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
}

interface CreateOrderDto {
  items: {
    productId: string;
    quantity: number;
  }[];
  shippingAddress: string;
  phone?: string;
  notes?: string;
}

interface UpdateOrderStatusDto {
  status: OrderStatus;
}
```

### Comment Types

```typescript
interface Comment {
  _id: string;
  userId: string | User;
  productId: string;
  content: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

interface CreateCommentDto {
  productId: string;
  content: string;
  rating: number;
}

interface UpdateCommentDto {
  content?: string;
  rating?: number;
}
```

### Upload Types

```typescript
interface UploadResponse {
  id: string;
  url: string;
  filename: string;
}

interface ImageInfo {
  id: string;
  filename: string;
  size: number;
  uploadDate: string;
}
```

---

## API Service Examples

### React/TypeScript API Service

```typescript
// api/config.ts
export const API_BASE_URL = 'http://localhost:3000';

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// api/auth.service.ts
import { API_BASE_URL, getAuthHeaders } from './config';

export const authService = {
  async register(data: RegisterDto): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  },

  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Login failed');
    const result = await response.json();
    localStorage.setItem('token', result.access_token);
    localStorage.setItem('user', JSON.stringify(result.user));
    return result;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN';
  },
};

// api/products.service.ts
export const productsService = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ProductsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    const response = await fetch(
      `${API_BASE_URL}/products?${queryParams}`,
      { headers: getAuthHeaders() }
    );
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  async getById(id: string): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Product not found');
    return response.json();
  },

  async create(data: CreateProductDto): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  },

  async update(id: string, data: UpdateProductDto): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete product');
  },
};

// api/orders.service.ts
export const ordersService = {
  async create(data: CreateOrderDto): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
  },

  async getMyOrders(): Promise<Order[]> {
    const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  async getAll(params?: {
    page?: number;
    limit?: number;
  }): Promise<OrdersResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await fetch(
      `${API_BASE_URL}/orders?${queryParams}`,
      { headers: getAuthHeaders() }
    );
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  async getById(id: string): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Order not found');
    return response.json();
  },

  async updateStatus(
    id: string,
    status: OrderStatus
  ): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update order status');
    return response.json();
  },
};

// api/comments.service.ts
export const commentsService = {
  async create(data: CreateCommentDto): Promise<Comment> {
    const response = await fetch(`${API_BASE_URL}/comments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create comment');
    return response.json();
  },

  async getByProduct(productId: string): Promise<Comment[]> {
    const response = await fetch(
      `${API_BASE_URL}/comments/product/${productId}`
    );
    if (!response.ok) throw new Error('Failed to fetch comments');
    return response.json();
  },

  async update(id: string, data: UpdateCommentDto): Promise<Comment> {
    const response = await fetch(`${API_BASE_URL}/comments/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update comment');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/comments/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete comment');
  },
};

// api/uploads.service.ts
export const uploadsService = {
  async uploadImage(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/uploads/image`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload image');
    return response.json();
  },

  async uploadMultipleImages(files: File[]): Promise<UploadResponse[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/uploads/images`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload images');
    return response.json();
  },

  async getAll(): Promise<ImageInfo[]> {
    const response = await fetch(`${API_BASE_URL}/uploads`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch images');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/uploads/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete image');
  },

  getImageUrl(id: string): string {
    return `${API_BASE_URL}/uploads/${id}`;
  },
};
```

---

## React Component Examples

### Login Component

```tsx
import React, { useState } from 'react';
import { authService } from '../api/auth.service';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      console.log('Logged in:', response.user);
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
```

### Product List Component

```tsx
import React, { useEffect, useState } from 'react';
import { productsService } from '../api/products.service';

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadProducts();
  }, [page]);

  const loadProducts = async () => {
    try {
      const response = await productsService.getAll({ page, limit: 12 });
      setProducts(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="product-grid">
        {products.map(product => (
          <div key={product._id} className="product-card">
            <img src={product.images[0]} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <p>Rating: {product.rating} ({product.reviewCount} reviews)</p>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button 
          onClick={() => setPage(p => p - 1)} 
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button 
          onClick={() => setPage(p => p + 1)}
          disabled={page * 12 >= total}
        >
          Next
        </button>
      </div>
    </div>
  );
};
```

### Image Upload Component

```tsx
import React, { useState } from 'react';
import { uploadsService } from '../api/uploads.service';

export const ImageUploader: React.FC<{
  onUploadComplete: (urls: string[]) => void;
}> = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Show preview
    const previews = files.map(file => URL.createObjectURL(file));
    setPreview(previews);

    setUploading(true);
    try {
      const results = await uploadsService.uploadMultipleImages(files);
      const urls = results.map(r => r.url);
      onUploadComplete(urls);
      alert('Images uploaded successfully!');
    } catch (error) {
      alert('Failed to upload images');
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
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
      <div className="preview-grid">
        {preview.map((url, i) => (
          <img key={i} src={url} alt={`Preview ${i}`} width="100" />
        ))}
      </div>
    </div>
  );
};
```

---

## Important Notes

### Authentication
- Store JWT token in localStorage
- Include token in Authorization header for protected routes
- Check user role before showing admin features
- Handle token expiration (default: 7 days)

### Pagination
- Default page size: 10 items
- Page numbers start at 1
- Calculate total pages: `Math.ceil(total / limit)`

### Image URLs
- Images are served from `/uploads/:id`
- Use full URL in img src: `http://localhost:3000/uploads/{id}`
- Images are publicly accessible (no auth required)

### Error Handling
- Always check response.ok before parsing JSON
- Display user-friendly error messages
- Handle network errors gracefully
- Validate input before sending requests

### Security
- Never store passwords in localStorage
- Always use HTTPS in production
- Validate user permissions on frontend
- Backend validates all requests (don't rely on frontend only)

### Performance
- Implement debouncing for search
- Use pagination for large lists
- Lazy load images
- Cache API responses when appropriate

---

## Quick Reference

### Customer Dashboard Features
- ✅ Browse products
- ✅ Search products
- ✅ View product details
- ✅ Create orders
- ✅ View order history
- ✅ Track order status
- ✅ Leave product reviews
- ✅ Edit/delete own reviews

### Admin Dashboard Features
- ✅ All customer features
- ✅ Create products
- ✅ Update products
- ✅ Delete products
- ✅ Upload product images
- ✅ View all orders
- ✅ Update order status
- ✅ Manage images

---

## Support

For questions or issues:
- Check Swagger UI: http://localhost:3000/api
- Review error responses
- Check browser console for errors
- Verify authentication token

**Happy coding! 🚀**
