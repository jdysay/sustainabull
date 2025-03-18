# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy only package.json and package-lock.json
COPY package.json package-lock.json ./

# Ensure correct platform-specific packages


RUN npm install --omit=optional


# Bundle app source inside the Docker image
COPY . .

# Build the React app (if necessary)
# If you do not have build step, just remove this line.
RUN npm run build

# Expose the port the app runs on
EXPOSE 5173

# Define environment variable
ENV NODE_ENV production

# Default command to run the app
# If you have your custom start command, replace this one.
CMD ["npm", "run", "dev"]

#Multi-stage build for production
# FROM node:20-alpine AS build

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# RUN npm run build

# # Use an official Nginx runtime as a parent image
# FROM nginx:stable-alpine

# # Copy the built React app from the build stage
# COPY --from=build /app/dist /usr/share/nginx/html

# # Copy the custom Nginx configuration
# # If you have your custom config file, replace this line.
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# # Expose port 80 (default HTTP port for Nginx)
# EXPOSE 80

# # Default command to run Nginx
# CMD ["nginx", "-g", "daemon off;"]
