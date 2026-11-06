ARG NODE_VERSION=22

# Stage 1: Build
FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

# Accept build arguments from Docker Compose
ARG DATABASE_URL_PROD
ARG JWT_SECRET

# Set them as environment variables so Prisma can read them during generate
ENV DATABASE_URL_PROD=$DATABASE_URL_PROD
ENV JWT_SECRET=$JWT_SECRET

COPY package*.json ./
RUN npm ci

COPY . .

# Now this will succeed because DATABASE_URL_PROD is available in the build environment
RUN npx prisma generate
RUN npm run build


# Stage 2: Production
FROM node:${NODE_VERSION}-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma
# (Optional note: you copied /app/prisma twice in your original file, you can keep one)
COPY --from=builder /app/src/config/openapi.yaml ./src/config/openapi.yaml

EXPOSE 3000

CMD ["node", "dist/src/server.js"]