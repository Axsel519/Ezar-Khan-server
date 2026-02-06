# GitHub Actions Auto-Deployment Setup Guide

This guide will help you set up automatic deployment to your VPS server whenever you push code to the master branch.

## 📋 Prerequisites

Before setting up GitHub Actions, ensure you have:

1. A VPS server with SSH access
2. Node.js 18+ installed on the VPS
3. PM2 installed globally on the VPS (`npm install -g pm2`)
4. Git installed on the VPS
5. Your project cloned on the VPS

## 🔑 Step 1: Generate SSH Key for GitHub Actions

On your local machine or VPS, generate a new SSH key pair:

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_key
```

This creates two files:
- `github_actions_key` (private key) - for GitHub Secrets
- `github_actions_key.pub` (public key) - for VPS

## 🖥️ Step 2: Configure Your VPS

### 2.1 Add the public key to authorized_keys

On your VPS server:

```bash
# Copy the public key content
cat ~/.ssh/github_actions_key.pub

# Add it to authorized_keys
echo "your-public-key-content" >> ~/.ssh/authorized_keys

# Set correct permissions
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### 2.2 Install required software (if not already installed)

```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Git
sudo apt install -y git
```

### 2.3 Clone your repository on VPS

```bash
# Navigate to your desired directory
cd /var/www  # or wherever you want to deploy

# Clone your repository
git clone https://github.com/your-username/your-repo.git
cd your-repo

# Install dependencies and build
npm ci --only=production
npm run build

# Create .env file with production settings
cp .env.example .env
nano .env  # Edit with your production values
```

### 2.4 Initial PM2 setup

```bash
# Start the application with PM2
pm2 start dist/main.js --name ecommerce-api

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Follow the command it outputs
```

## 🔐 Step 3: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

### Required Secrets:

1. **VPS_HOST**
   - Value: Your VPS IP address or domain
   - Example: `123.45.67.89` or `yourdomain.com`

2. **VPS_USERNAME**
   - Value: SSH username for your VPS
   - Example: `root` or `ubuntu` or your custom user

3. **VPS_SSH_KEY**
   - Value: Content of your private key (`github_actions_key`)
   - Get it with: `cat ~/.ssh/github_actions_key`
   - Copy the entire content including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`

4. **VPS_PORT**
   - Value: SSH port (usually 22)
   - Example: `22`

5. **VPS_PROJECT_PATH**
   - Value: Absolute path to your project on VPS
   - Example: `/var/www/your-repo` or `/home/ubuntu/ezar-khan-be`

### How to add secrets:

```
GitHub Repository → Settings → Secrets and variables → Actions → New repository secret
```

For each secret:
1. Click "New repository secret"
2. Enter the name (e.g., VPS_HOST)
3. Paste the value
4. Click "Add secret"

## 🚀 Step 4: Test the Deployment

1. Make a small change to your code
2. Commit and push to master:

```bash
git add .
git commit -m "Test auto-deployment"
git push origin master
```

3. Go to your GitHub repository → Actions tab
4. Watch the deployment workflow run
5. Check your VPS to verify the deployment

## 📊 Step 5: Monitor Deployments

### View GitHub Actions logs:
- Go to your repository → Actions tab
- Click on the latest workflow run
- Expand each step to see detailed logs

### Check application on VPS:

```bash
# SSH into your VPS
ssh your-username@your-vps-ip

# Check PM2 status
pm2 status

# View application logs
pm2 logs ecommerce-api

# Monitor in real-time
pm2 monit
```

## 🔧 Customization Options

### Add environment variables to deployment

If you need to update environment variables during deployment, modify the workflow:

```yaml
script: |
  cd ${{ secrets.VPS_PROJECT_PATH }}
  git pull origin master
  npm ci --only=production
  npm run build
  
  # Update environment variables
  echo "NODE_ENV=production" > .env
  echo "PORT=3000" >> .env
  echo "MONGODB_URI=${{ secrets.MONGODB_URI }}" >> .env
  echo "JWT_SECRET=${{ secrets.JWT_SECRET }}" >> .env
  
  pm2 restart ecommerce-api || pm2 start dist/main.js --name ecommerce-api
  pm2 save
```

### Add database migrations

```yaml
script: |
  cd ${{ secrets.VPS_PROJECT_PATH }}
  git pull origin master
  npm ci --only=production
  npm run build
  npm run migrate  # Add your migration command
  pm2 restart ecommerce-api
```

### Add Slack/Discord notifications

Add this step at the end of your workflow:

```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 🐛 Troubleshooting

### Deployment fails with "Permission denied"
- Check SSH key is correctly added to VPS authorized_keys
- Verify VPS_SSH_KEY secret contains the full private key
- Ensure correct file permissions on VPS: `chmod 600 ~/.ssh/authorized_keys`

### "pm2: command not found"
- Install PM2 globally on VPS: `sudo npm install -g pm2`
- Or use full path: `/usr/local/bin/pm2` in the workflow

### Git pull fails with "Permission denied"
- Ensure the VPS user has read access to the repository
- For private repos, add deploy key to GitHub or use HTTPS with token

### Application doesn't restart
- Check PM2 logs: `pm2 logs ecommerce-api`
- Verify the app name matches: `pm2 list`
- Try manual restart: `pm2 restart ecommerce-api`

### Port already in use
- Check what's using the port: `sudo lsof -i :3000`
- Stop the process: `pm2 stop ecommerce-api`
- Restart: `pm2 start ecommerce-api`

## 🔒 Security Best Practices

1. **Use a dedicated deployment user** instead of root:
```bash
sudo adduser deployer
sudo usermod -aG sudo deployer
```

2. **Restrict SSH key usage** - Add to `~/.ssh/authorized_keys`:
```
command="cd /var/www/your-repo && git pull && npm ci && npm run build && pm2 restart ecommerce-api",no-port-forwarding,no-X11-forwarding,no-agent-forwarding ssh-ed25519 AAAA...
```

3. **Use environment-specific secrets** - Never commit sensitive data

4. **Enable firewall**:
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

5. **Regular security updates**:
```bash
sudo apt update && sudo apt upgrade -y
```

## 📈 Advanced: Zero-Downtime Deployment

For zero-downtime deployments, use PM2 cluster mode:

```yaml
script: |
  cd ${{ secrets.VPS_PROJECT_PATH }}
  git pull origin master
  npm ci --only=production
  npm run build
  pm2 reload ecommerce-api --update-env
```

Initial setup on VPS:
```bash
pm2 start dist/main.js -i max --name ecommerce-api
pm2 save
```

## ✅ Deployment Checklist

- [ ] SSH key generated and added to VPS
- [ ] All GitHub secrets configured
- [ ] PM2 installed and configured on VPS
- [ ] Project cloned and built on VPS
- [ ] .env file configured on VPS
- [ ] Initial PM2 process started
- [ ] Test deployment successful
- [ ] Application accessible via browser
- [ ] Logs monitored for errors

## 📞 Need Help?

If you encounter issues:
1. Check GitHub Actions logs for error messages
2. SSH into VPS and check PM2 logs: `pm2 logs`
3. Verify all secrets are correctly set
4. Ensure VPS has enough resources (disk space, memory)

Happy deploying! 🚀
