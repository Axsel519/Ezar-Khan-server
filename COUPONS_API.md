# Coupons API Documentation

## Overview
The coupons feature allows admins to create, manage, and track discount coupons. Users can apply valid coupons during checkout to receive percentage-based discounts on their orders.

## Coupon Schema
```typescript
{
  code: string;              // Unique coupon code (auto-converted to uppercase)
  discountPercentage: number; // Discount percentage (0-100)
  isActive: boolean;         // Whether the coupon is active
  expiresAt?: Date;          // Optional expiration date
  usageCount: number;        // Number of times the coupon has been used
  maxUsage?: number;         // Optional maximum usage limit
}
```

## API Endpoints

### Admin Routes (Requires Admin Role)

#### 1. Create Coupon
```
POST /coupons
Authorization: Bearer <admin_token>

Body:
{
  "code": "SUMMER20",
  "discountPercentage": 20,
  "isActive": true,
  "expiresAt": "2024-12-31T23:59:59Z",
  "maxUsage": 100
}

Response: Created coupon object
```

#### 2. Get All Coupons
```
GET /coupons
Authorization: Bearer <admin_token>

Response: Array of all coupons
```

#### 3. Get Single Coupon
```
GET /coupons/:id
Authorization: Bearer <admin_token>

Response: Coupon object
```

#### 4. Update Coupon
```
PATCH /coupons/:id
Authorization: Bearer <admin_token>

Body:
{
  "discountPercentage": 25,
  "isActive": false
}

Response: Updated coupon object
```

#### 5. Delete Coupon
```
DELETE /coupons/:id
Authorization: Bearer <admin_token>

Response: 200 OK
```

### User Routes (Requires Authentication)

#### 6. Validate Coupon
```
GET /coupons/validate?code=SUMMER20
Authorization: Bearer <user_token>

Response:
{
  "valid": true,
  "message": null,
  "discountPercentage": 20
}

OR (if invalid):
{
  "valid": false,
  "message": "Coupon has expired",
  "discountPercentage": null
}
```

## Using Coupons in Orders

When creating an order, include the `couponCode` field:

```
POST /orders
Authorization: Bearer <user_token>

Body:
{
  "items": [...],
  "shippingAddress": "123 Main St",
  "phone": "1234567890",
  "couponCode": "SUMMER20"
}

Response:
{
  "items": [...],
  "totalAmount": 80,        // Discounted price
  "originalAmount": 100,    // Original price before discount
  "discountPercentage": 20,
  "couponCode": "SUMMER20",
  ...
}
```

## Validation Rules

A coupon is considered valid if:
1. The coupon exists in the database
2. `isActive` is `true`
3. Not expired (if `expiresAt` is set)
4. Usage count hasn't reached `maxUsage` (if set)

## Frontend Integration

### Validation Flow
1. User enters coupon code in checkout form
2. Frontend calls `GET /coupons/validate?code=<CODE>`
3. Display validation result to user
4. If valid, show discount percentage
5. Include `couponCode` in order creation request

### Example Frontend Validation
```javascript
async function validateCoupon(code) {
  const response = await fetch(`/api/coupons/validate?code=${code}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const result = await response.json();
  
  if (result.valid) {
    // Show success message with discount percentage
    console.log(`Coupon valid! ${result.discountPercentage}% discount`);
  } else {
    // Show error message
    console.log(`Invalid coupon: ${result.message}`);
  }
}
```

## Order Schema Updates

The Order schema now includes:
- `couponCode`: The applied coupon code (if any)
- `discountPercentage`: The discount percentage applied
- `originalAmount`: The original total before discount
- `totalAmount`: The final amount after discount

## Notes

- Coupon codes are automatically converted to uppercase
- When a valid coupon is applied, the `usageCount` is automatically incremented
- Discounts are calculated as: `finalPrice = originalPrice * (1 - discountPercentage / 100)`
- Only percentage-based discounts are supported (0-100%)
