# Quick Start Guide

Get your e-commerce API up and running in 5 minutes!

## 🚀 Prerequisites

- Node.js 18+ installed
- MongoDB installed and running
- Git installed

## 📦 Installation

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd ezar-khan-be

# Install dependencies
npm install
```

### 2. Configure Environment

```bash
# Copy environment file
cp .env.example .env
```

The default `.env` file is already configured for local development:
```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 3. Start MongoDB

**Option A: Local MongoDB**
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

**Option B: Docker**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Seed Database (Optional but Recommended)

```bash
npm run seed
```

This creates:
- Admin user: `admin@example.com` / `Admin@123456`
- Customer users: `john@example.com` / `Customer@123`
- 10 sample products

### 5. Start the Application

```bash
npm run start:dev
```

## ✅ Verify Installation

1. **Check API is running**
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-31T12:00:00.000Z",
  "uptime": 10.5,
  "environment": "development"
}
```

2. **Open Swagger Documentation**

Visit: http://localhost:3000/api

## 🎯 Test the API

### 1. Register a New User

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

### 2. Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin@123456"
  }'
```

Save the `access_token` from the response.

### 3. Get Products

```bash
curl http://localhost:3000/products
```

### 4. Create a Product (Admin Only)

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "New Product",
    "description": "Product description",
    "price": 99.99,
    "stock": 50,
    "category": "Electronics"
  }'
```

## 🎨 Using Swagger UI

1. Go to http://localhost:3000/api
2. Click "Authorize" button
3. Enter: `Bearer YOUR_ACCESS_TOKEN`
4. Click "Authorize"
5. Now you can test all endpoints interactively!

## 📱 Common Use Cases

### Customer Flow

1. **Register** → `POST /auth/register`
2. **Login** → `POST /auth/login`
3. **Browse Products** → `GET /products`
4. **View Product Details** → `GET /products/:id`
5. **Create Order** → `POST /orders`
6. **View My Orders** → `GET /orders/my-orders`
7. **Leave Review** → `POST /comments`

### Admin Flow

1. **Login as Admin** → `POST /auth/login`
2. **Create Product** → `POST /products`
3. **Update Product** → `PATCH /products/:id`
4. **View All Orders** → `GET /orders`
5. **Update Order Status** → `PATCH /orders/:id/status`

## 🔧 Development Commands

```bash
# Start development server with hot reload
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format

# Seed database
npm run seed
```

## 🐳 Using Docker

```bash
# Start all services (API + MongoDB)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Seed database in Docker
docker-compose exec api npm run seed
```

## 🆘 Troubleshooting

### MongoDB Connection Error

**Problem:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution:**
- Ensure MongoDB is running: `mongod` or `sudo systemctl start mongod`
- Check connection string in `.env`
- Try: `mongodb://127.0.0.1:27017/ecommerce` instead of `localhost`

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

Or change PORT in `.env` file.

### JWT Secret Error

**Problem:** `secretOrPrivateKey must have a value`

**Solution:** Ensure `JWT_SECRET` is set in `.env` file.

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Explore the API using Swagger UI at http://localhost:3000/api
- Customize the code for your specific needs

## 💡 Tips

- Use Postman or Insomnia for easier API testing
- Keep your JWT tokens secure
- Change default passwords in production
- Enable MongoDB authentication for production
- Use environment-specific `.env` files

## 🎉 You're Ready!

Your e-commerce API is now running. Start building your frontend or mobile app!

For questions or issues, check the documentation or open an issue on GitHub.
