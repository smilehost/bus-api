# Stage 1: Build
FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# generate Prisma Client
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "start"]