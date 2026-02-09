FROM node:20-slim

WORKDIR /app

# Install dependencies needed for Prisma
RUN apt-get update -y && apt-get install -y openssl

# Install application dependencies
COPY package*.json ./
RUN npm install

# Copy source code and prisma schema
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose Nuxt port
EXPOSE 3000

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

CMD ["npm", "run", "dev"]
