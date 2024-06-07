# Stage 1: Build Stage
FROM node:19-bullseye AS build-stage

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production Stage
FROM node:19-bullseye AS production-stage

# Set working directory
WORKDIR /app

# Copy node_modules and dist from build stage
COPY --from=build-stage /app/node_modules ./node_modules
COPY --from=build-stage /app/dist ./dist

# Expose port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]
