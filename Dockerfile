# Build stage
FROM node:20-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --production

# Copy built assets and server
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

# Create data directory
RUN mkdir -p /app/data

# Expose only the backend port (frontend will be served through the same port)
EXPOSE 3001

# Start the application
CMD ["node", "server/index.js"]