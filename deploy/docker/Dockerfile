FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml* package-lock.json* ./
RUN npm install --production || npm ci --production

# Copy built files
COPY dist/ ./dist/

# Copy config example
COPY .env.example ./.env.example

# Create non-root user
RUN addgroup -g 1000 -S multiclaw && \
    adduser -u 1000 -S multiclaw -G multiclaw
USER multiclaw

EXPOSE 3000

CMD ["node", "dist/index.js"]