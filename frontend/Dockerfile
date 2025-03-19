# Use official Node.js LTS as the base image
FROM node:21

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) to install dependencies first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
# Ensure a .dockerignore file is present to avoid copying files/modules like node_modules to avoid problems
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application (build and start in one step)
CMD ["npm", "start"]


# Old, where next was build and then run with Docker, but this is now combined into the start command in package.json for the frontend:
# # Stage 1: Build the Next.js App
# FROM node:21 AS builder

# # Set working directory
# WORKDIR /app

# # Copy package.json and package-lock.json (if available) to install dependencies first
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of the application code
# # Ensure a .dockerignore file is present to avoid copying files/modules like node_modules to avoid problems
# COPY . .

# # Build the Next.js application
# RUN npm run build

# # Stage 2: Production Image (Only contains the built app)
# FROM node:21 AS runner

# # Set working directory
# WORKDIR /app

# # Copy built files from the builder stage
# COPY --from=builder /app/.next .next
# COPY --from=builder /app/package*.json ./

# # Install dependencies
# RUN npm install

# # Expose the port the app runs on
# EXPOSE 3000

# # Start the Next.js server
# CMD ["npm", "run", "start"]


# Another old solution for development (but not suited for deployment environment):
# # Use official Node.js LTS as the base image
# FROM node:21

# # Set the working directory inside the container
# WORKDIR /app

# # Copy package.json and package-lock.json (if available) to install dependencies first
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of the application code
# # Ensure a .dockerignore file is present to avoid copying files/modules like node_modules to avoid problems
# COPY . .

# # Expose the port the app runs on
# EXPOSE 3000

# # Start the application
# CMD ["npm", "run", "dev"]
