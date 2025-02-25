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
EXPOSE 4001

# Start the application
CMD ["npm", "run", "start"]
