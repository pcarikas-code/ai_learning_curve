#!/bin/bash

# AI Learning Curve - Docker Build Script
# This script builds the Docker image for the application

set -e  # Exit on error

echo "🔨 Building AI Learning Curve Docker image..."

# Build the Docker image
docker build -t ai-learning-curve:latest .

echo "✅ Docker image built successfully!"
echo ""
echo "Image: ai-learning-curve:latest"
echo ""
echo "To deploy this image, run: ./deploy.sh"
