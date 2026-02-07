#!/bin/sh
set -e

echo "👉 Running database seed..."
yarn migrate:up
yarn seed

echo "🚀 Starting NestJS API..."
exec node dist/src/main.js
