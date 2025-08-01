#!/bin/bash

# Frontend Deployment Script
echo "🚀 Deploying ApnaDera Frontend..."

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the apnadera-frontend directory"
    exit 1
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env not found. Please create it from .env.example"
    echo "📝 Copy .env.example to .env and update the values"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if installation was successful
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build files are in the 'dist' directory"
    echo "🌐 You can now deploy the 'dist' folder to your hosting service"
    
    # Show build size
    echo "📊 Build size:"
    du -sh dist/
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Frontend deployment script completed!"
echo "📋 Next steps:"
echo "   1. Upload the 'dist' folder to your hosting service"
echo "   2. Configure environment variables in your hosting dashboard"
echo "   3. Set up custom domain if needed" 