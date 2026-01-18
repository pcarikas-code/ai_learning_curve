#!/bin/bash

##############################################################################
# AI Learning Curve - Automated Deployment Script for Plesk
# Domain: theailearningcurve.com
##############################################################################

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="ai-learning-curve"
DOMAIN="theailearningcurve.com"
DB_NAME="ai_learning_curve"
DB_USER="ai_learning_user"
CONTAINER_NAME="ai-learning-curve"
PORT=3005

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}AI Learning Curve - Deployment Script${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

##############################################################################
# Step 1: Check if .env file exists
##############################################################################
echo -e "${YELLOW}[1/8] Checking environment configuration...${NC}"

if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found!${NC}"
    echo ""
    echo "Please create a .env file first. You can copy from .env.example:"
    echo "  cp .env.example .env"
    echo ""
    echo "Then edit .env and fill in your configuration values."
    exit 1
fi

# Source the .env file
source .env

echo -e "${GREEN}✓ Environment configuration found${NC}"
echo ""

##############################################################################
# Step 2: Check if database exists, create if not
##############################################################################
echo -e "${YELLOW}[2/8] Setting up database...${NC}"

# Extract database credentials from DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}Error: DATABASE_URL not set in .env file!${NC}"
    exit 1
fi

# Parse DATABASE_URL (format: mysql://user:pass@host:port/dbname)
DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_PASS=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')

if [ -z "$DB_HOST" ]; then
    DB_HOST="localhost"
fi

if [ -z "$DB_PORT" ]; then
    DB_PORT="3306"
fi

# Check if database exists
DB_EXISTS=$(mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASS -e "SHOW DATABASES LIKE '$DB_NAME';" 2>/dev/null | grep -c $DB_NAME || true)

if [ "$DB_EXISTS" -eq "0" ]; then
    echo "Database does not exist. Creating..."
    mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASS -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null || {
        echo -e "${RED}Error: Could not create database. Please create it manually in Plesk:${NC}"
        echo "  Database name: $DB_NAME"
        echo "  User: $DB_USER"
        echo "  Then update your .env file with the correct DATABASE_URL"
        exit 1
    }
    echo -e "${GREEN}✓ Database created successfully${NC}"
else
    echo -e "${GREEN}✓ Database already exists${NC}"
fi

echo ""

##############################################################################
# Step 3: Pull latest code from GitHub
##############################################################################
echo -e "${YELLOW}[3/8] Pulling latest code from GitHub...${NC}"

git pull origin main || {
    echo -e "${RED}Error: Failed to pull from GitHub${NC}"
    exit 1
}

echo -e "${GREEN}✓ Code updated${NC}"
echo ""

##############################################################################
# Step 4: Stop and remove existing container
##############################################################################
echo -e "${YELLOW}[4/8] Stopping existing container (if any)...${NC}"

if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo "Stopping running container..."
    docker stop $CONTAINER_NAME
fi

if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    echo "Removing old container..."
    docker rm $CONTAINER_NAME
fi

echo -e "${GREEN}✓ Old container removed${NC}"
echo ""

##############################################################################
# Step 5: Build Docker image
##############################################################################
echo -e "${YELLOW}[5/8] Building Docker image...${NC}"
echo "This may take 5-10 minutes..."
echo ""

docker build -t $APP_NAME:latest . || {
    echo -e "${RED}Error: Docker build failed${NC}"
    exit 1
}

echo -e "${GREEN}✓ Docker image built successfully${NC}"
echo ""

##############################################################################
# Step 6: Run new container
##############################################################################
echo -e "${YELLOW}[6/8] Starting new container...${NC}"

docker run -d \
  --name $CONTAINER_NAME \
  --restart unless-stopped \
  -p $PORT:$PORT \
  --env-file .env \
  $APP_NAME:latest || {
    echo -e "${RED}Error: Failed to start container${NC}"
    exit 1
}

echo -e "${GREEN}✓ Container started${NC}"
echo ""

##############################################################################
# Step 7: Wait for container to be ready and run migrations
##############################################################################
echo -e "${YELLOW}[7/8] Running database migrations...${NC}"

# Wait for container to be ready
echo "Waiting for application to start..."
sleep 10

# Run migrations
docker exec -it $CONTAINER_NAME pnpm db:push || {
    echo -e "${RED}Error: Database migration failed${NC}"
    echo "Container logs:"
    docker logs $CONTAINER_NAME
    exit 1
}

echo -e "${GREEN}✓ Database migrations completed${NC}"
echo ""

##############################################################################
# Step 8: Verify deployment
##############################################################################
echo -e "${YELLOW}[8/8] Verifying deployment...${NC}"

# Check if container is running
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo -e "${GREEN}✓ Container is running${NC}"
else
    echo -e "${RED}✗ Container is not running${NC}"
    echo "Container logs:"
    docker logs $CONTAINER_NAME
    exit 1
fi

# Test HTTP endpoint
sleep 5
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/ || echo "000")

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✓ Application is responding (HTTP $HTTP_STATUS)${NC}"
else
    echo -e "${YELLOW}⚠ Application returned HTTP $HTTP_STATUS${NC}"
    echo "This might be normal if the app is still starting up."
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Your application is now running at:"
echo -e "  ${GREEN}http://localhost:$PORT${NC}"
echo -e "  ${GREEN}https://$DOMAIN${NC} (if nginx is configured)"
echo ""
echo "Useful commands:"
echo "  View logs:     docker logs -f $CONTAINER_NAME"
echo "  Restart:       docker restart $CONTAINER_NAME"
echo "  Stop:          docker stop $CONTAINER_NAME"
echo "  Shell access:  docker exec -it $CONTAINER_NAME sh"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Configure nginx reverse proxy in Plesk (see PLESK_DEPLOYMENT.md)"
echo "2. Set up SSL certificate in Plesk"
echo "3. Test your application at https://$DOMAIN"
echo ""
