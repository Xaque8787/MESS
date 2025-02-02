FROM node:20-alpine as builder

WORKDIR /app

# Set master key for builder stage
ENV MASTER_KEY=abcdefghijklmnopqrstuvwx

# Install build dependencies first
RUN apk add --no-cache \
    bash \
    jq \
    python3 \
    py3-pip \
    git \
    docker-cli \
    docker-compose

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Create required directories
RUN mkdir -p /app/compose/installed && \
    mkdir -p /app/compose/not_installed && \
    mkdir -p /app/compose/overrides

# Copy source files
COPY . .

# Set up Python environment
RUN python3 -m venv /app/virt_env && \
    /app/virt_env/bin/pip install --upgrade pip --timeout 100 --retries 5 && \
    /app/virt_env/bin/pip install /app/scripts/utils/server_setup-0.0.1-py3-none-any.whl --timeout 100 --retries 5

# Set file permissions
RUN chmod +x /app/scripts/entrypoint.js && \
    chmod +x /app/scripts/utils/format_env.sh && \
    chmod +x /app/scripts/utils/resolve_host.sh && \
    chmod +x /app/scripts/utils/shared_env.sh && \
    find /app/scripts/apps -type f \( -name "*.sh" -o -name "*.py" \) -exec chmod +x {} +

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Set master key for production stage
ENV MASTER_KEY=abcdefghijklmnopqrstuvwx

# Install production dependencies
RUN apk add --no-cache \
    bash \
    jq \
    python3 \
    py3-pip \
    git \
    docker-cli \
    docker-compose

# Create data directory
RUN mkdir -p /app/data

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/compose ./compose
COPY --from=builder /app/public ./public

# Copy and set up Python environment
COPY --from=builder /app/virt_env ./virt_env
COPY scripts/utils/server_setup-0.0.1-py3-none-any.whl ./scripts/utils/
RUN python3 -m venv /app/virt_env && \
    /app/virt_env/bin/pip install --upgrade pip --timeout 100 --retries 5 && \
    /app/virt_env/bin/pip install /app/scripts/utils/server_setup-0.0.1-py3-none-any.whl --timeout 100 --retries 5

# Set file permissions in production stage
RUN chmod +x /app/scripts/utils/format_env.sh && \
    chmod +x /app/scripts/utils/resolve_host.sh && \
    chmod +x /app/scripts/utils/shared_env.sh && \
    find /app/scripts/apps -type f \( -name "*.sh" -o -name "*.py" \) -exec chmod +x {} +

# Copy and set up entrypoint script
COPY scripts/docker-entrypoint.sh /app/scripts/docker-entrypoint.sh
RUN chmod +x /app/scripts/docker-entrypoint.sh

# Expose port
EXPOSE 3001

# Set entrypoint and default command
ENTRYPOINT ["/app/scripts/docker-entrypoint.sh"]
CMD ["node", "server/index.js"]