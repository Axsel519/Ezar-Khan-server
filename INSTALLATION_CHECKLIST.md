# Installation Checklist ✅

Use this checklist to verify your e-commerce API is properly set up and ready to use.

## 📋 Pre-Installation

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] MongoDB 6+ installed or Docker available
- [ ] Git installed (optional)

## 🔧 Installation Steps

### 1. Project Setup
- [ ] Repository cloned or downloaded
- [ ] Navigate to project directory
- [ ] Run `npm install` successfully
- [ ] No installation errors

### 2. Environment Configuration
- [ ] `.env` file created (copy from `.env.example`)
- [ ] `MONGODB_URI` configured
- [ ] `JWT_SECRET` set (min 32 characters)
- [ ] `PORT` configured (default: 3000)
- [ ] `NODE_ENV` set (development/production)
- [ ] `CORS_ORIGIN` configured

### 3. Database Setup
- [ ] MongoDB service running
- [ ] Database connection successful
- [ ] Can connect to MongoDB URI

### 4. Build Verification
- [ ] Run `npm run build` successfully
- [ ] No TypeScript errors
- [ ] `dist` folder created

## 🚀 First Run

### 5. Start Application
- [ ] Run `npm run start:dev`
- [ ] Server starts without errors
- [ ] See startup messages:
  - ✅ "Application is running on: http://localhost:3000"
  - ✅ "Swagger documentation: http://localhost:3000/api"
  - ✅ "Environment: development"

### 6. Seed Database (Recommended)
- [ ] Run `npm run seed` in new terminal
- [ ] Seeding completes successfully
- [ ] Admin user created
- [ ] Customer users created
- [ ] Sample products created

### 7. Verify Endpoints

#### Health Check
- [ ] Visit http://localhost:3000/health
- [ ] Returns JSON with status "ok"

#### API Documentation
- [ ] Visit http://localhost:3000/api
- [ ] Swagger UI loads
- [ ] All endpoints visible
- [ ] Can expand endpoint details

#### Root Endpoint
- [ ] Visit http://localhost:3000
- [ ] Returns API info message

## 🧪 Functionality Tests

### 8. Authentication
- [ ] Can register new user via Swagger
- [ ] Can login with seeded admin (admin@example.com / Admin@123456)
- [ ] Receives JWT token
- [ ] Can authorize in Swagger UI with token

### 9. Products
- [ ] Can view products list (GET /products)
- [ ] Can view single product (GET /products/:id)
- [ ] Can search products (GET /products?search=wireless)
- [ ] Admin can create product (POST /products)
- [ ] Admin can update product (PATCH /products/:id)
- [ ] Admin can delete product (DELETE /products/:id)

### 10. Orders
- [ ] Customer can create order (POST /orders)
- [ ] Can view own orders (GET /orders/my-orders)
- [ ] Admin can view all orders (GET /orders)
- [ ] Admin can update order status (PATCH /orders/:id/status)
- [ ] Stock decreases after order

### 11. Comments
- [ ] Can create product review (POST /comments)
- [ ] Can view product reviews (GET /comments/product/:id)
- [ ] Can update own review (PATCH /comments/:id)
- [ ] Can delete own review (DELETE /comments/:id)
- [ ] Product rating updates after review

## 🔒 Security Tests

### 12. Authentication & Authorization
- [ ] Cannot access protected routes without token
- [ ] Customer cannot create products
- [ ] Customer cannot view all orders
- [ ] Customer cannot update order status
- [ ] Users can only edit own comments
- [ ] Invalid tokens are rejected

### 13. Validation
- [ ] Invalid email format rejected
- [ ] Weak passwords rejected
- [ ] Missing required fields rejected
- [ ] Invalid MongoDB IDs rejected
- [ ] Out of range values rejected (e.g., rating > 5)

## 📊 Performance Tests

### 14. Database
- [ ] Queries execute quickly (< 100ms for simple queries)
- [ ] Pagination works correctly
- [ ] Search returns relevant results
- [ ] Indexes are created (check MongoDB)

### 15. Rate Limiting
- [ ] Rate limiting active (10 req/min)
- [ ] Excessive requests blocked
- [ ] Returns 429 status when limited

## 🐳 Docker Tests (Optional)

### 16. Docker Setup
- [ ] `docker-compose up -d` runs successfully
- [ ] MongoDB container running
- [ ] API container running
- [ ] Can access API at http://localhost:3000
- [ ] Can seed database in Docker: `docker-compose exec api npm run seed`

## 📝 Documentation

### 17. Documentation Files
- [ ] README.md present and readable
- [ ] QUICKSTART.md present
- [ ] DEPLOYMENT.md present
- [ ] API_TESTING.md present
- [ ] FEATURES.md present
- [ ] PROJECT_SUMMARY.md present

### 18. Code Quality
- [ ] No TypeScript errors
- [ ] ESLint passes (run `npm run lint`)
- [ ] Code formatted (run `npm run format`)
- [ ] All imports resolve correctly

## 🎯 Production Readiness

### 19. Security Checklist
- [ ] JWT_SECRET changed from default
- [ ] Strong JWT_SECRET (min 32 chars)
- [ ] MongoDB authentication enabled (production)
- [ ] CORS_ORIGIN set to specific domain (production)
- [ ] NODE_ENV set to production
- [ ] Helmet middleware active
- [ ] Rate limiting configured

### 20. Deployment Preparation
- [ ] Environment variables documented
- [ ] Build process works (`npm run build`)
- [ ] Production start works (`npm run start:prod`)
- [ ] Health check endpoint accessible
- [ ] Logs are readable and informative

## ✅ Final Verification

### All Systems Go!
- [ ] Application starts successfully
- [ ] Database connected
- [ ] All endpoints working
- [ ] Authentication working
- [ ] Authorization working
- [ ] Swagger documentation accessible
- [ ] No console errors
- [ ] Health check returns OK

## 🎉 Success Criteria

Your installation is successful if:

1. ✅ Server starts without errors
2. ✅ Can access Swagger UI
3. ✅ Can login with seeded credentials
4. ✅ Can create, read, update, delete resources
5. ✅ Security features working (auth, validation)
6. ✅ Health check returns OK

## 🐛 Troubleshooting

If any checks fail, refer to:
- [QUICKSTART.md](QUICKSTART.md) - Setup issues
- [README.md](README.md) - General documentation
- [API_TESTING.md](API_TESTING.md) - Testing issues
- Server logs - Detailed error messages

## 📞 Common Issues

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
mongod --version
# Start MongoDB
mongod
# Or use Docker
docker run -d -p 27017:27017 mongo:latest
```

### Port Already in Use
```bash
# Change PORT in .env file
PORT=3001
```

### JWT Secret Error
```bash
# Ensure JWT_SECRET is set in .env
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
```

### Build Errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 🚀 Next Steps

Once all checks pass:

1. ✅ Read [QUICKSTART.md](QUICKSTART.md) for usage examples
2. ✅ Explore [API_TESTING.md](API_TESTING.md) for testing
3. ✅ Review [FEATURES.md](FEATURES.md) for capabilities
4. ✅ Check [DEPLOYMENT.md](DEPLOYMENT.md) for production
5. ✅ Start building your frontend!

---

**Congratulations! Your e-commerce API is ready to use! 🎉**

For questions or issues, refer to the documentation or check the inline code comments.
