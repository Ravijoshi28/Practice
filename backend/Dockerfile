FROM node:22-bookworm-slim
WORKDIR /app

COPY package*.json ./
COPY prisma7.config.ts ./
COPY prisma ./prisma

RUN DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" npm ci


COPY . .
EXPOSE 4000
CMD ["npm", "start"]