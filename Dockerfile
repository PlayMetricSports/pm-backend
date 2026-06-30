FROM node:22-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm i --omit=dev

# Copy application code
COPY . .


ENV NODE_ENV=production

# Expose application port
EXPOSE 9112

# Start the application
CMD ["npm", "start"]