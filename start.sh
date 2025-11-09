#!/bin/bash

echo "🚀 Starting Kinks Profile Service..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start PostgreSQL
echo "📦 Starting PostgreSQL..."
docker-compose -f docker-compose.dev.yml up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Run migrations
echo "🔧 Running database migrations..."
pnpm prisma migrate deploy

# Generate Prisma client
echo "📝 Generating Prisma client..."
pnpm prisma generate

# Start development server
echo "🌐 Starting development server..."
pnpm dev
