# Production Deployment Guide

This guide covers deploying the E-commerce API to production environments.

## 🚀 Quick Start with Docker

The easiest way to deploy is using Docker Compose:

```bash
# Clone the repository
git clone <repository-url>
cd ezar-khan-be

# Update environment variables in docker-compose.yml
# Change JWT_SECRET and MongoDB credentials

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f api

# Seed the database
docker-compose exec api npm run seed
```

Access the API at `http://localhost:3000` and documentation at `http://localhost:3000/api`

## 📦 Manual Deployment

### Prerequisites
- Node.js 18+
- MongoDB 6+
- PM2 (for process management)

### Steps

1. **Install dependencies**
```bash
npm ci --only=production
```

2. **Build the application**
```bash
npm run build
```

3. **Set environment variables**
```bash
export MONGODB_URI="mongodb://username:password@host:27017/ecommerce"
export JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
export NODE_ENV="production"
export PORT="3000"
export CORS_ORIGIN="https://yourdomain.com"
```

4. **Start with PM2**
```bash
pm2 start dist/main.js --name ecommerce-api
pm2 save
pm2 startup
```

## ☁️ Cloud Platform Deployment

### AWS EC2

1. **Launch EC2 instance** (Ubuntu 22.04 LTS)

2. **Install dependencies**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2
sudo npm install -g pm2
```

3. **Deploy application**
```bash
# Clone repository
git clone <repository-url>
cd ezar-khan-be

# Install and build
npm ci --only=production
npm run build

# Configure environment
cp .env.example .env
nano .env  # Edit with production values

# Start application
pm2 start dist/main.js --name ecommerce-api
pm2 save
pm2 startup
```

4. **Configure Nginx reverse proxy**
```bash
sudo apt install -y nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/ecommerce-api
```

Add configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/ecommerce-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

5. **Setup SSL with Let's Encrypt**
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Heroku

1. **Install Heroku CLI**
```bash
npm install -g heroku
heroku login
```

2. **Create Heroku app**
```bash
heroku create your-app-name
```

3. **Add MongoDB Atlas**
```bash
# Sign up at https://www.mongodb.com/cloud/atlas
# Create cluster and get connection string
heroku config:set MONGODB_URI="your-mongodb-atlas-uri"
```

4. **Set environment variables**
```bash
heroku config:set JWT_SECRET="your-secret-key"
heroku config:set NODE_ENV="production"
heroku config:set CORS_ORIGIN="https://your-frontend.com"
```

5. **Deploy**
```bash
git push heroku main
heroku logs --tail
```

### DigitalOcean App Platform

1. **Create new app** in DigitalOcean dashboard

2. **Connect GitHub repository**

3. **Configure build settings**
- Build Command: `npm run build`
- Run Command: `node dist/main`

4. **Add MongoDB database** (Managed Database)

5. **Set environment variables** in app settings

6. **Deploy**

### Vercel (Serverless)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Create vercel.json**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/main.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/main.js"
    }
  ]
}
```

3. **Deploy**
```bash
vercel --prod
```

## 🔒 Security Checklist

- [ ] Change default JWT_SECRET to strong random string (min 32 chars)
- [ ] Use environment variables for all sensitive data
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure CORS for specific origins only
- [ ] Set up MongoDB authentication
- [ ] Use MongoDB connection string with credentials
- [ ] Enable rate limiting (already configured)
- [ ] Set up firewall rules
- [ ] Regular security updates
- [ ] Monitor application logs
- [ ] Set up backup strategy for MongoDB
- [ ] Use strong passwords for admin accounts

## 📊 Monitoring

### PM2 Monitoring
```bash
pm2 monit
pm2 logs ecommerce-api
pm2 status
```

### Health Check Endpoint
```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-31T12:00:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

## 🔄 Updates and Maintenance

### Update Application
```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm ci --only=production

# Build
npm run build

# Restart with PM2
pm2 restart ecommerce-api
```

### Database Backup
```bash
# Backup MongoDB
mongodump --uri="mongodb://username:password@host:27017/ecommerce" --out=/backup/$(date +%Y%m%d)

# Restore MongoDB
mongorestore --uri="mongodb://username:password@host:27017/ecommerce" /backup/20240131
```

## 🐛 Troubleshooting

### Application won't start
- Check MongoDB connection
- Verify environment variables
- Check logs: `pm2 logs ecommerce-api`
- Ensure port 3000 is available

### Database connection issues
- Verify MongoDB is running: `sudo systemctl status mongod`
- Check connection string format
- Verify network access and firewall rules

### High memory usage
- Monitor with: `pm2 monit`
- Restart application: `pm2 restart ecommerce-api`
- Consider scaling horizontally

## 📈 Scaling

### Horizontal Scaling with PM2
```bash
pm2 start dist/main.js -i max --name ecommerce-api
```

### Load Balancing with Nginx
```nginx
upstream api_backend {
    server localhost:3000;
    server localhost:3001;
    server localhost:3002;
}

server {
    location / {
        proxy_pass http://api_backend;
    }
}
```

## 📞 Support

For deployment issues, contact: support@example.com
