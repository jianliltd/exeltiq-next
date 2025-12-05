#!/bin/bash

# Supabase Migration Script for Vercel Deployments
# This script runs database migrations and deploys edge functions during build

set -e

echo "=== Supabase Deployment Script ==="

# Database migrations
if [ -z "$DATABASE_URL" ]; then
  echo "DATABASE_URL is not set. Skipping database migrations."
else
  echo "Running database migrations..."
  npx supabase db push --db-url "$DATABASE_URL" --include-all
  echo "Database migrations completed."
fi

# Edge Functions deployment (requires Docker - skip on Vercel)
if ! command -v docker &> /dev/null || ! docker info &> /dev/null; then
  echo "Docker not available. Skipping edge functions deployment."
  echo "Deploy edge functions manually or via Supabase GitHub integration."
  exit 0      
else
  echo "Deploying edge functions..."
  SUPABASE_ACCESS_TOKEN="$SUPABASE_ACCESS_TOKEN" npx supabase functions deploy --project-ref nonxtltpvbjzvcqbgsle
  echo "Edge functions deployed."
fi

echo "=== Supabase deployment completed ==="