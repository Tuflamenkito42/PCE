FROM node:20-slim

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose Nuxt port
EXPOSE 3000

# Set environment variables for Nuxt to listen on all interfaces
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

CMD ["npm", "run", "dev"]
