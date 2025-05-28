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

# ✅ ติดตั้ง Neovim จาก binary + LazyVim dependencies
RUN apt-get update && apt-get install -y \
    git curl unzip ripgrep fd-find \
    && rm -rf /var/lib/apt/lists/*

# ติดตั้ง Neovim เวอร์ชันเจาะจง
ENV NVIM_VERSION=0.9.5
RUN curl -LO https://github.com/neovim/neovim/releases/download/v${NVIM_VERSION}/nvim-linux64.tar.gz && \
    tar xzf nvim-linux64.tar.gz && \
    mv nvim-linux64 /opt/nvim && \
    ln -s /opt/nvim/bin/nvim /usr/local/bin/nvim && \
    rm nvim-linux64.tar.gz

# ติดตั้ง LazyVim
RUN git clone https://github.com/LazyVim/starter ~/.config/nvim && \
    rm -rf ~/.config/nvim/.git

# ✅ คัดลอกไฟล์จาก builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/cmd ./cmd
COPY --from=builder /app/cmd/server/public ./cmd/server/public

EXPOSE 8000

CMD ["npm", "run", "start"]