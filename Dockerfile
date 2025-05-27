# Stage 1: Build
FROM node:22 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

# Stage 2: Runtime
FROM node:22-slim

WORKDIR /app

# ✅ ติดตั้ง openssl + neovim + LazyVim dependencies
RUN apt-get update && apt-get install -y \
  openssl \
  neovim \
  git \
  curl \
  unzip \
  && rm -rf /var/lib/apt/lists/*

# ✅ ติดตั้ง LazyVim
RUN git clone https://github.com/LazyVim/starter ~/.config/nvim && \
  rm -rf ~/.config/nvim/.git

# ✅ คัดลอกไฟล์จาก builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/cmd ./cmd

EXPOSE 8000

CMD ["npm", "run", "start"]