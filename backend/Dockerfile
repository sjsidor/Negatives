# Development stage
FROM node:20-slim

WORKDIR /app

# Install build dependencies, sqlite3, file command, and libheif
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    sqlite3 \
    file \
    libheif-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Rebuild SQLite3 for the container
RUN npm rebuild sqlite3

# Create uploads directory and ensure data directory exists
RUN mkdir -p uploads data

# Expose development port
EXPOSE 3001

# Start development server with hot reload
CMD ["npm", "run", "dev"] 