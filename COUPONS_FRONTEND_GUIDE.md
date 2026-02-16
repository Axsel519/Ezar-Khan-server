# Coupons API - Frontend Integration Guide

## Base URL
All endpoints are prefixed with your API base URL (e.g., `http://localhost:3000` or your production URL)

---

## 🔐 Authentication
All routes require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📋 API Routes

### 1. Create Coupon (Admin Only)
**Endpoint:** `POST /coupons`  
**Auth Required:** Yes (Admin role)  
**Description:** Create a new discount coupon

**Request Body:**
```typescript
{
  code: string;              // Required - Coupon code (will be auto-converted to uppercase)
  discountPercentage: number; // Required - Discount percentage (0-100)
  isActive?: boolean;        // Optional - Default: true
  expiresAt?: string;        // Optional - ISO date string (e.g., "2024-12-31T23:59:59Z")
  maxUsage?: number;         // Optional - Maximum number of times coupon can be used
}
```

**Example Request:**
```javascript
const response = await fetch('http://localhost:3000/coupons', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  },
  body: JSON.stringify({
    code: "SUMMER20",
    discountPercentage: 20,
    isActive: true,
    expiresAt: "2024-12-31T23:59:59.000Z",
    maxUsage: 100
  })
});

const coupon = await response.json();
```

**Success Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "code": "SUMMER20",
  "discountPercentage": 20,
  "isActive": true,
  "expiresAt": "2024-12-31T23:59:59.000Z",
  "usageCount": 0,
  "maxUsage": 100,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

### 2. Get All Coupons (Admin Only)
**Endpoint:** `GET /coupons`  
**Auth Required:** Yes (Admin role)  
**Description:** Retrieve all coupons

**Request Body:** None

**Example Request:**
```javascript
const response = await fetch('http://localhost:3000/coupons', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${adminToken}`
  }
});

const coupons = await response.json();
```

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "code": "SUMMER20",
    "discountPercentage": 20,
    "isActive": true,
    "expiresAt": "2024-12-31T23:59:59.000Z",
    "usageCount": 15,
    "maxUsage": 100,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "code": "WELCOME10",
    "discountPercentage": 10,
    "isActive": true,
    "usageCount": 50,
    "createdAt": "2024-01-10T08:00:00.000Z",
    "updatedAt": "2024-01-10T08:00:00.000Z"
  }
]
```

---

### 3. Get Single Coupon (Admin Only)
**Endpoint:** `GET /coupons/:id`  
**Auth Required:** Yes (Admin role)  
**Description:** Retrieve a specific coupon by ID

**URL Parameters:**
- `id` (string) - MongoDB ObjectId of the coupon

**Request Body:** None

**Example Request:**
```javascript
const couponId = "507f1f77bcf86cd799439011";
const response = await fetch(`http://localhost:3000/coupons/${couponId}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${adminToken}`
  }
});

const coupon = await response.json();
```

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "code": "SUMMER20",
  "discountPercentage": 20,
  "isActive": true,
  "expiresAt": "2024-12-31T23:59:59.000Z",
  "usageCount": 15,
  "maxUsage": 100,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (404):**
```json
{
  "statusCode": 404,
  "message": "Coupon not found"
}
```

---

### 4. Update Coupon (Admin Only)
**Endpoint:** `PATCH /coupons/:id`  
**Auth Required:** Yes (Admin role)  
**Description:** Update an existing coupon

**URL Parameters:**
- `id` (string) - MongoDB ObjectId of the coupon

**Request Body:** (All fields optional)
```typescript
{
  code?: string;
  discountPercentage?: number;
  isActive?: boolean;
  expiresAt?: string;
  maxUsage?: number;
}
```

**Example Request:**
```javascript
const couponId = "507f1f77bcf86cd799439011";
const response = await fetch(`http://localhost:3000/coupons/${couponId}`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  },
  body: JSON.stringify({
    discountPercentage: 25,
    isActive: false
  })
});

const updatedCoupon = await response.json();
```

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "code": "SUMMER20",
  "discountPercentage": 25,
  "isActive": false,
  "expiresAt": "2024-12-31T23:59:59.000Z",
  "usageCount": 15,
  "maxUsage": 100,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-20T14:45:00.000Z"
}
```

---

### 5. Delete Coupon (Admin Only)
**Endpoint:** `DELETE /coupons/:id`  
**Auth Required:** Yes (Admin role)  
**Description:** Delete a coupon

**URL Parameters:**
- `id` (string) - MongoDB ObjectId of the coupon

**Request Body:** None

**Example Request:**
```javascript
const couponId = "507f1f77bcf86cd799439011";
const response = await fetch(`http://localhost:3000/coupons/${couponId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${adminToken}`
  }
});
```

**Success Response (200):** Empty response

**Error Response (404):**
```json
{
  "statusCode": 404,
  "message": "Coupon not found"
}
```

---

### 6. Validate Coupon (All Authenticated Users)
**Endpoint:** `GET /coupons/validate?code=<COUPON_CODE>`  
**Auth Required:** Yes (Any authenticated user)  
**Description:** Check if a coupon code is valid for use

**Query Parameters:**
- `code` (string) - The coupon code to validate

**Request Body:** None

**Example Request:**
```javascript
const couponCode = "SUMMER20";
const response = await fetch(`http://localhost:3000/coupons/validate?code=${couponCode}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${userToken}`
  }
});

const validation = await response.json();
```

**Success Response (200) - Valid Coupon:**
```json
{
  "valid": true,
  "message": null,
  "discountPercentage": 20
}
```

**Success Response (200) - Invalid Coupon:**
```json
{
  "valid": false,
  "message": "Coupon not found",
  "discountPercentage": null
}
```

**Possible Error Messages:**
- `"Coupon not found"`
- `"Coupon is not active"`
- `"Coupon has expired"`
- `"Coupon usage limit reached"`

---

### 7. Create Order with Coupon (Updated)
**Endpoint:** `POST /orders`  
**Auth Required:** Yes (Any authenticated user)  
**Description:** Create an order with optional coupon code

**Request Body:**
```typescript
{
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingAddress: string;
  phone: string;
  notes?: string;
  paymentMethod?: string;
  couponCode?: string;  // NEW FIELD - Optional coupon code
}
```

**Example Request:**
```javascript
const response = await fetch('http://localhost:3000/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`
  },
  body: JSON.stringify({
    items: [
      { productId: "507f1f77bcf86cd799439011", quantity: 2 },
      { productId: "507f1f77bcf86cd799439012", quantity: 1 }
    ],
    shippingAddress: "123 Main St, City, Country",
    phone: "1234567890",
    notes: "Please deliver in the morning",
    paymentMethod: "cash-on-delivery",
    couponCode: "SUMMER20"  // Apply coupon
  })
});

const order = await response.json();
```

**Success Response (201) - With Coupon:**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "userId": "507f1f77bcf86cd799439010",
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "productName": "Product A",
      "quantity": 2,
      "price": 50
    }
  ],
  "originalAmount": 100,
  "discountPercentage": 20,
  "totalAmount": 80,
  "couponCode": "SUMMER20",
  "status": "pending",
  "shippingAddress": "123 Main St, City, Country",
  "phone": "1234567890",
  "notes": "Please deliver in the morning",
  "paymentMethod": "cash-on-delivery",
  "createdAt": "2024-01-20T15:00:00.000Z",
  "updatedAt": "2024-01-20T15:00:00.000Z"
}
```

**Success Response (201) - Without Coupon:**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "userId": "507f1f77bcf86cd799439010",
  "items": [...],
  "totalAmount": 100,
  "discountPercentage": 0,
  "status": "pending",
  "shippingAddress": "123 Main St, City, Country",
  "phone": "1234567890",
  "paymentMethod": "cash-on-delivery",
  "createdAt": "2024-01-20T15:00:00.000Z",
  "updatedAt": "2024-01-20T15:00:00.000Z"
}
```

---

## 🎨 Frontend Implementation Examples

### React Example - Coupon Validation in Checkout Form

```jsx
import { useState } from 'react';

function CheckoutForm() {
  const [couponCode, setCouponCode] = useState('');
  const [couponValidation, setCouponValidation] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  const validateCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsValidating(true);
    try {
      const response = await fetch(
        `http://localhost:3000/coupons/validate?code=${couponCode}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      const result = await response.json();
      setCouponValidation(result);
    } catch (error) {
      console.error('Error validating coupon:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const calculateTotal = (subtotal) => {
    if (couponValidation?.valid) {
      const discount = subtotal * (couponValidation.discountPercentage / 100);
      return subtotal - discount;
    }
    return subtotal;
  };

  return (
    <div>
      {/* Coupon Input */}
      <div>
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon code"
        />
        <button onClick={validateCoupon} disabled={isValidating}>
          {isValidating ? 'Validating...' : 'Apply'}
        </button>
      </div>

      {/* Validation Result */}
      {couponValidation && (
        <div>
          {couponValidation.valid ? (
            <p style={{ color: 'green' }}>
              ✓ Coupon applied! {couponValidation.discountPercentage}% discount
            </p>
          ) : (
            <p style={{ color: 'red' }}>
              ✗ {couponValidation.message}
            </p>
          )}
        </div>
      )}

      {/* Order Summary */}
      <div>
        <p>Subtotal: ${subtotal}</p>
        {couponValidation?.valid && (
          <>
            <p>Discount ({couponValidation.discountPercentage}%): 
              -${(subtotal * couponValidation.discountPercentage / 100).toFixed(2)}
            </p>
          </>
        )}
        <p><strong>Total: ${calculateTotal(subtotal).toFixed(2)}</strong></p>
      </div>
    </div>
  );
}
```

### Admin Panel - Coupon Management

```jsx
function CouponManagement() {
  const [coupons, setCoupons] = useState([]);
  const [formData, setFormData] = useState({
    code: '',
    discountPercentage: 0,
    isActive: true,
    expiresAt: '',
    maxUsage: ''
  });

  // Fetch all coupons
  const fetchCoupons = async () => {
    const response = await fetch('http://localhost:3000/coupons', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });
    const data = await response.json();
    setCoupons(data);
  };

  // Create coupon
  const createCoupon = async (e) => {
    e.preventDefault();
    
    const payload = {
      code: formData.code,
      discountPercentage: Number(formData.discountPercentage),
      isActive: formData.isActive,
      ...(formData.expiresAt && { expiresAt: new Date(formData.expiresAt).toISOString() }),
      ...(formData.maxUsage && { maxUsage: Number(formData.maxUsage) })
    };

    const response = await fetch('http://localhost:3000/coupons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      fetchCoupons();
      // Reset form
      setFormData({
        code: '',
        discountPercentage: 0,
        isActive: true,
        expiresAt: '',
        maxUsage: ''
      });
    }
  };

  // Delete coupon
  const deleteCoupon = async (id) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    await fetch(`http://localhost:3000/coupons/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });

    fetchCoupons();
  };

  return (
    <div>
      <h2>Coupon Management</h2>
      
      {/* Create Form */}
      <form onSubmit={createCoupon}>
        <input
          type="text"
          placeholder="Coupon Code"
          value={formData.code}
          onChange={(e) => setFormData({...formData, code: e.target.value})}
          required
        />
        <input
          type="number"
          placeholder="Discount %"
          min="0"
          max="100"
          value={formData.discountPercentage}
          onChange={(e) => setFormData({...formData, discountPercentage: e.target.value})}
          required
        />
        <input
          type="datetime-local"
          value={formData.expiresAt}
          onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
        />
        <input
          type="number"
          placeholder="Max Usage (optional)"
          value={formData.maxUsage}
          onChange={(e) => setFormData({...formData, maxUsage: e.target.value})}
        />
        <label>
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
          />
          Active
        </label>
        <button type="submit">Create Coupon</button>
      </form>

      {/* Coupons List */}
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Discount</th>
            <th>Status</th>
            <th>Usage</th>
            <th>Expires</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map(coupon => (
            <tr key={coupon._id}>
              <td>{coupon.code}</td>
              <td>{coupon.discountPercentage}%</td>
              <td>{coupon.isActive ? 'Active' : 'Inactive'}</td>
              <td>{coupon.usageCount}{coupon.maxUsage ? `/${coupon.maxUsage}` : ''}</td>
              <td>{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : 'No expiry'}</td>
              <td>
                <button onClick={() => deleteCoupon(coupon._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## 📝 TypeScript Interfaces

```typescript
// Coupon Interface
interface Coupon {
  _id: string;
  code: string;
  discountPercentage: number;
  isActive: boolean;
  expiresAt?: string;
  usageCount: number;
  maxUsage?: number;
  createdAt: string;
  updatedAt: string;
}

// Create Coupon DTO
interface CreateCouponDto {
  code: string;
  discountPercentage: number;
  isActive?: boolean;
  expiresAt?: string;
  maxUsage?: number;
}

// Update Coupon DTO
interface UpdateCouponDto {
  code?: string;
  discountPercentage?: number;
  isActive?: boolean;
  expiresAt?: string;
  maxUsage?: number;
}

// Validation Response
interface CouponValidationResponse {
  valid: boolean;
  message: string | null;
  discountPercentage: number | null;
}

// Order with Coupon
interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  originalAmount?: number;
  discountPercentage: number;
  couponCode?: string;
  status: string;
  shippingAddress: string;
  phone: string;
  notes?: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## ⚠️ Error Handling

All endpoints may return these common errors:

**401 Unauthorized:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**403 Forbidden (Admin routes for non-admin users):**
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

**400 Bad Request (Invalid coupon during order creation):**
```json
{
  "statusCode": 400,
  "message": "Coupon has expired"
}
```

---

## 💡 Best Practices

1. **Validate coupons before order submission** - Use the `/coupons/validate` endpoint in real-time
2. **Show discount breakdown** - Display original price, discount amount, and final price
3. **Handle expired coupons gracefully** - Show clear error messages
4. **Convert codes to uppercase** - The backend does this automatically, but doing it on frontend improves UX
5. **Cache validation results** - Don't re-validate on every keystroke, use debouncing
6. **Show usage statistics** - In admin panel, display how many times each coupon has been used
