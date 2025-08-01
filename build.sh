#!/bin/bash

echo "🚀 Building ApnaDera Frontend..."

# Clear any existing node_modules
echo "🧹 Cleaning previous build..."
rm -rf node_modules package-lock.json

# Install all dependencies (including devDependencies)
echo "📦 Installing dependencies..."
npm install

# Verify vite is installed
if ! command -v vite &> /dev/null; then
    echo "❌ Error: Vite not found after installation"
    echo "📋 Checking package.json..."
    cat package.json | grep -A 5 -B 5 vite
    exit 1
fi

echo "✅ Vite found successfully"

# Build the project
echo "🔨 Building project..."
npm run build

echo "✅ Build complete!"
echo "📁 Build output: dist/" 