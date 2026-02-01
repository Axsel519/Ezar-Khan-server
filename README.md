# E-commerce API - Production Ready

A complete, production-ready e-commerce REST API built with NestJS and MongoDB. Features include user authentication, product management, order processing, and product reviews.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin/Customer)
  - Secure password hashing with bcrypt

- **Product Management**
  - CRUD operations for products
  - Product search with full-text search
  - Pagination support
  - Stock management
  - Product ratings and reviews

- **Order Management**
  - Create and track orders
  - Order status management
  - Automatic stock updates
  - Order history for users

- **Reviews & Comments**
  - Product reviews with ratings
  - Automatic product rating calculation
  - User-specific comment management

- **Security & Performance**
  - Helmet for security headers
  - CORS configuration
  - Rate limiting with throttler
  - Request validation
  - Compression middleware

- **API Documentation**
  - Interactive Swagger/OpenAPI documentation
  - Auto-generated from code decorators

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ezar-khan-be
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

4. Start MongoDB:
```bash
# Using MongoDB service
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## 🚀 Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

## 📚 API Documentation

Once the application is running, access the Swagger documentation at:
```
http://localhost:3000/api
```

## 🔑 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Products
- `GET /products` - Get all products (with pagination & search)
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product (Admin only)
- `PATCH /products/:id` - Update product (Admin only)
- `DELETE /products/:id` - Delete product (Admin only)

### Orders
- `POST /orders` - Create order
- `GET /orders` - Get all orders (Admin only)
- `GET /orders/my-orders` - Get current user orders
- `GET /orders/:id` - Get order by ID
- `PATCH /orders/:id/status` - Update order status (Admin only)

### Comments
- `POST /comments` - Create comment/review
- `GET /comments/product/:productId` - Get product comments
- `PATCH /comments/:id` - Update comment
- `DELETE /comments/:id` - Delete comment

## 🔐 Authentication

The API uses JWT Bearer tokens. After login, include the token in requests:

```bash
Authorization: Bearer <your-jwt-token>
```

## 👥 User Roles

- **CUSTOMER**: Can browse products, create orders, and leave reviews
- **ADMIN**: Full access to all endpoints including product and order management

## 📦 Database Schema

### User
- email (unique)
- password (hashed)
- firstName
- lastName
- role (CUSTOMER/ADMIN)
- phone
- address
- timestamps

### Product
- name
- description
- price
- stock
- images (array)
- rating
- reviewCount
- isActive
- category
- brand
- timestamps

### Order
- userId (ref: User)
- items (embedded array)
  - productId
  - productName
  - quantity
  - price
- totalAmount
- status (PENDING/PROCESSING/SHIPPED/DELIVERED/CANCELLED)
- shippingAddress
- phone
- notes
- timestamps

### Comment
- userId (ref: User)
- productId (ref: Product)
- content
- rating (1-5)
- timestamps

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🏗️ Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── dto/             # Data transfer objects
│   ├── strategies/      # Passport strategies
│   └── ...
├── products/            # Products module
├── orders/              # Orders module
├── comments/            # Comments module
├── common/              # Shared resources
│   ├── decorators/      # Custom decorators
│   ├── guards/          # Auth guards
│   └── enums/           # Enumerations
├── schemas/             # MongoDB schemas
├── app.module.ts        # Root module
└── main.ts              # Application entry point
```

## 🔒 Security Best Practices

- Passwords are hashed using bcrypt
- JWT tokens for stateless authentication
- Rate limiting to prevent abuse
- Input validation on all endpoints
- Helmet for security headers
- CORS configuration
- MongoDB injection prevention

## 🚀 Production Deployment

### Environment Variables
Ensure all production environment variables are set:
- Use strong JWT_SECRET (min 32 characters)
- Set NODE_ENV=production
- Configure proper CORS_ORIGIN
- Use MongoDB connection string with authentication

### MongoDB Setup
```bash
# Create production database user
use ecommerce
db.createUser({
  user: "ecommerce_user",
  pwd: "strong_password",
  roles: [{ role: "readWrite", db: "ecommerce" }]
})
```

### Build and Run
```bash
npm run build
NODE_ENV=production npm run start:prod
```

### Using PM2 (Recommended)
```bash
npm install -g pm2
pm2 start dist/main.js --name ecommerce-api
pm2 save
pm2 startup
```

## 📊 Monitoring

Monitor your application with PM2:
```bash
pm2 monit
pm2 logs ecommerce-api
```

## 🐳 Docker Support

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/main"]
```

Build and run:
```bash
docker build -t ecommerce-api .
docker run -p 3000:3000 --env-file .env ecommerce-api
```

## 📝 License

This project is licensed under the UNLICENSED License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📧 Support

For support, email support@example.com or open an issue in the repository.
