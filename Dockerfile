# Stage 1: Build
FROM node:22 AS builder

# Set working directory
WORKDIR /app

# Copy dependencies and install
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript code
RUN npm run build

# Stage 2: Runtime
FROM node:22-slim

WORKDIR /app

# Copy only what's needed from builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

# Expose your app port
EXPOSE 8000

# Start the app
CMD ["npm", "run", "start"]