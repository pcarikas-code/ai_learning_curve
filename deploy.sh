#!/bin/bash

##############################################################################
# AI Learning Curve - Automated Deployment Script for Plesk
# Domain: theailearningcurve.com
#
# Usage: ./deploy.sh
# 
# Prerequisites:
# - Pull latest code from GitHub via Plesk UI before running this script
# - .env file must exist with DATABASE_URL configured
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
CONTAINER_NAME="ai-learning-curve"
PORT=3005

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}AI Learning Curve - Deployment Script${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

##############################################################################
# Step 1: Check if .env file exists
##############################################################################
echo -e "${YELLOW}[1/5] Checking environment configuration...${NC}"

if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found!${NC}"
    echo ""
    echo "Please create a .env file with your configuration."
    echo "Required: DATABASE_URL=mysql://user:pass@host:port/database"
    exit 1
fi

echo -e "${GREEN}✓ Environment configuration found${NC}"
echo ""

##############################################################################
# Step 2: Stop and remove existing container
##############################################################################
echo -e "${YELLOW}[2/5] Stopping existing container (if any)...${NC}"

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
# Step 3: Build Docker image
##############################################################################
echo -e "${YELLOW}[3/5] Building Docker image...${NC}"
echo "This may take 5-10 minutes..."
echo ""

docker build -t $APP_NAME:latest . || {
    echo -e "${RED}Error: Docker build failed${NC}"
    exit 1
}

echo -e "${GREEN}✓ Docker image built successfully${NC}"
echo ""

##############################################################################
# Step 4: Run new container
##############################################################################
echo -e "${YELLOW}[4/5] Starting new container...${NC}"

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
# Step 5: Verify deployment
##############################################################################
echo -e "${YELLOW}[5/5] Verifying deployment...${NC}"

# Wait for container to be ready
echo "Waiting for application to start..."
sleep 10

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
echo -e "  ${GREEN}https://$DOMAIN${NC}"
echo ""
echo "Useful commands:"
echo "  View logs:     docker logs -f $CONTAINER_NAME"
echo "  Restart:       docker restart $CONTAINER_NAME"
echo "  Stop:          docker stop $CONTAINER_NAME"
echo "  Shell access:  docker exec -it $CONTAINER_NAME sh"
echo ""
echo -e "${YELLOW}Database commands (if needed):${NC}"
echo "  Run migrations:  docker exec -it $CONTAINER_NAME pnpm tsx migrate.ts"
echo "  Seed database:   docker exec -it $CONTAINER_NAME pnpm tsx seed-db.ts"
echo ""
