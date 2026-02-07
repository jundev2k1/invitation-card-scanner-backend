# Use Node 20 LTS
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy Yarn files
COPY package.json yarn.lock ./

# Install deps with Yarn
RUN yarn install --frozen-lockfile

# Copy source
COPY . .

# Build NestJS
RUN yarn build

# Expose Nest port
EXPOSE 3000

# Use entrypoint script
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Run app
ENTRYPOINT ["/app/docker-entrypoint.sh"]
