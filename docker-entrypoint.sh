#!/bin/sh
set -e

echo "👉 Running database seed..."
yarn migrate:up:prod
yarn seed:prod

echo "🚀 Starting NestJS API..."
exec node dist/src/main.js
