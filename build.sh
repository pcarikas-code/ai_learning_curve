#!/bin/bash

##############################################################################
# AI Learning Curve - Docker Build Script
# 
# Usage: ./build.sh
#
# This script only builds the Docker image. Use ./deploy.sh for full deployment.
##############################################################################

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="ai-learning-curve"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}AI Learning Curve - Build Script${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

echo "🔨 Building Docker image..."
echo "This may take 5-10 minutes..."
echo ""

docker build -t $APP_NAME:latest . || {
    echo -e "${RED}Error: Docker build failed${NC}"
    exit 1
}

echo ""
echo -e "${GREEN}✅ Docker image built successfully!${NC}"
echo ""
echo "Image: $APP_NAME:latest"
echo ""
echo "To deploy, run: ./deploy.sh"
echo ""
