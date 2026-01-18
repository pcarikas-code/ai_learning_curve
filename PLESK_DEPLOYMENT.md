# AI Learning Curve - Plesk Docker Deployment Guide

This guide provides step-by-step instructions for deploying the AI Learning Curve platform to a Plesk server using Docker.

---

## Prerequisites

Before starting, ensure you have:

- **Plesk Panel** with Docker extension installed
- **SSH access** to your Plesk server
- **MySQL database** created in Plesk (or external database)
- **Domain name** configured in Plesk and pointed to your server
- **Git** installed on the server
- **Docker** and **Docker Compose** installed (via Plesk Docker extension)

---

## Step 1: Prepare the Database

### 1.1 Create MySQL Database in Plesk

1. Log into Plesk Panel
2. Go to **Databases** → **Add Database**
3. Create a new database:
   - Database name: `ai_learning_curve`
   - User: `ai_learning_user`
   - Password: Generate a strong password
4. Note the database connection details:
   ```
   Host: localhost (or your database host)
   Port: 3306
   Database: ai_learning_curve
   User: ai_learning_user
   Password: [your-password]
   ```

### 1.2 Construct Database URL

Format your `DATABASE_URL` as:
```
mysql://ai_learning_user:[your-password]@localhost:3306/ai_learning_curve
```

---

## Step 2: Clone the Repository

### 2.1 SSH into Your Server

```bash
ssh your-user@your-server.com
```

### 2.2 Navigate to Your Domain Directory

```bash
cd /var/www/vhosts/your-domain.com
```

### 2.3 Clone the Repository

```bash
git clone https://github.com/your-username/ai-learning-curve.git
cd ai-learning-curve
```

---

## Step 3: Configure Environment Variables

### 3.1 Create .env File

Create a `.env` file in the project root:

```bash
nano .env
```

### 3.2 Add Environment Variables

```env
# Database
DATABASE_URL=mysql://ai_learning_user:your-password@localhost:3306/ai_learning_curve

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Manus OAuth (if using Manus auth)
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im/app

# Owner Info
OWNER_OPEN_ID=your-owner-id
OWNER_NAME=Your Name

# Manus Forge API (if using built-in services)
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=your-forge-api-key
VITE_FRONTEND_FORGE_API_KEY=your-frontend-api-key
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.im

# SMTP Configuration (for email features)
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-email-password
SMTP_FROM=noreply@your-domain.com

# App Configuration
NODE_ENV=production
PORT=3005
```

Save and exit (`Ctrl+X`, then `Y`, then `Enter`).

---

## Step 4: Build and Run with Docker

### Method A: Using Docker Commands (Recommended for Plesk)

This method uses standard Docker commands for maximum compatibility.

#### 4.1 Build the Docker Image

```bash
docker build -t ai-learning-curve:latest .
```

This will take 5-10 minutes depending on your server speed.

#### 4.2 Run the Container

```bash
docker run -d \
  --name ai-learning-curve \
  --restart unless-stopped \
  -p 3005:3005 \
  --env-file .env \
  ai-learning-curve:latest
```

#### 4.3 Verify the Container is Running

```bash
docker ps | grep ai-learning-curve
```

You should see output showing the container is running.

#### 4.4 Check Container Logs

```bash
docker logs ai-learning-curve
```

Look for "Server running on http://localhost:3005/"

### Method B: Using Docker Compose (Alternative)

If you prefer Docker Compose:

```bash
docker compose up -d
```

---

## Step 5: Run Database Migrations

After the container is running, execute database migrations:

```bash
docker exec -it ai-learning-curve pnpm db:push
```

This will create all necessary database tables.

---

## Step 6: Configure Nginx Reverse Proxy in Plesk

### 6.1 Access Plesk Domain Settings

1. Go to **Domains** → Select your domain
2. Click **Apache & nginx Settings**

### 6.2 Add Nginx Directives

In the **Additional nginx directives** section, add:

```nginx
location / {
    proxy_pass http://localhost:3005;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

Click **OK** to save.

### 6.3 Enable SSL Certificate

1. Go to **SSL/TLS Certificates**
2. Click **Install** or use Let's Encrypt to get a free SSL certificate
3. Enable **Redirect from HTTP to HTTPS**

---

## Step 7: Test the Deployment

### 7.1 Access Your Application

Visit your domain in a browser:
```
https://your-domain.com
```

You should see the AI Learning Curve homepage.

### 7.2 Test Registration

1. Click "Get Started Free"
2. Complete a module
3. Register with name and email
4. Verify progress is saved

---

## Maintenance Commands

### View Container Logs

```bash
docker logs ai-learning-curve
docker logs -f ai-learning-curve  # Follow logs in real-time
```

### Restart the Container

```bash
docker restart ai-learning-curve
```

### Stop the Container

```bash
docker stop ai-learning-curve
```

### Start the Container

```bash
docker start ai-learning-curve
```

### Remove the Container

```bash
docker stop ai-learning-curve
docker rm ai-learning-curve
```

### Rebuild After Code Changes

```bash
# Pull latest code
git pull origin main

# Rebuild image
docker build -t ai-learning-curve:latest .

# Stop and remove old container
docker stop ai-learning-curve
docker rm ai-learning-curve

# Run new container
docker run -d \
  --name ai-learning-curve \
  --restart unless-stopped \
  -p 3005:3005 \
  --env-file .env \
  ai-learning-curve:latest

# Run migrations if schema changed
docker exec -it ai-learning-curve pnpm db:push
```

---

## Troubleshooting

### Container Won't Start

**Check logs:**
```bash
docker logs ai-learning-curve
```

**Common issues:**
- Missing environment variables in `.env`
- Database connection failure (check `DATABASE_URL`)
- Port 3000 already in use

### Database Connection Errors

**Verify database credentials:**
```bash
mysql -u ai_learning_user -p ai_learning_curve
```

**Check if MySQL is accessible from Docker:**
- If using `localhost`, try `host.docker.internal` or your server's IP
- Ensure MySQL allows connections from Docker network

### Application Not Accessible

**Check nginx configuration:**
```bash
nginx -t  # Test nginx config
systemctl restart nginx  # Restart nginx
```

**Verify container is running:**
```bash
docker ps
curl http://localhost:3000  # Test from server
```

### SSL Certificate Issues

- Ensure domain DNS points to your server
- Wait 5-10 minutes after DNS changes
- Try Let's Encrypt certificate renewal in Plesk

---

## Performance Optimization

### Enable Gzip Compression

Add to nginx directives in Plesk:

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

### Enable Caching

Add to nginx directives:

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## Security Recommendations

1. **Change default JWT_SECRET** to a strong random string
2. **Use strong database passwords**
3. **Keep Docker images updated:**
   ```bash
   docker pull node:22-alpine
   docker build -t ai-learning-curve:latest .
   ```
4. **Enable Plesk firewall** and only allow necessary ports
5. **Regular backups** of database and `.env` file
6. **Monitor logs** for suspicious activity

---

## Backup and Restore

### Backup Database

```bash
docker exec ai-learning-curve pnpm db:backup > backup-$(date +%Y%m%d).sql
```

Or use Plesk's built-in database backup feature.

### Restore Database

```bash
docker exec -i ai-learning-curve mysql -u ai_learning_user -p ai_learning_curve < backup-20250118.sql
```

---

## Support

For issues or questions:
- Check container logs: `docker logs ai-learning-curve`
- Review this guide's troubleshooting section
- Contact your hosting provider for Plesk-specific issues

---

## Summary

You've successfully deployed AI Learning Curve to Plesk using Docker! Your application is now:

✅ Running in a Docker container
✅ Accessible via your domain with SSL
✅ Connected to MySQL database
✅ Ready for users to register and track progress

Remember to monitor logs regularly and keep your Docker images updated for security.
