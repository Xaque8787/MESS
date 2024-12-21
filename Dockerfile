FROM node:20-alpine as builder

WORKDIR /app

# Install bash and jq for scripts
RUN apk add --no-cache bash jq

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code and scripts
COPY . .

# Make scripts executable
RUN chmod +x /app/scripts/entrypoint.js && \
    find /app/scripts/apps -type f -name "*.sh" -exec chmod +x {} +

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install bash and jq for scripts
RUN apk add --no-cache bash jq

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --production

# Copy built assets, server, and scripts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/scripts ./scripts

# Ensure scripts are executable in production
RUN chmod +x /app/scripts/entrypoint.js && \
    find /app/scripts/apps -type f -name "*.sh" -exec chmod +x {} +

# Create data directory
RUN mkdir -p /app/data

# Expose only the backend port
EXPOSE 3001

# Start the application
CMD ["node", "server/index.js"]