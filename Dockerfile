# Use a Node.js base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the entire project
COPY . .

# Build the Angular app for production
RUN npm run build

# Install a lightweight HTTP server
RUN npm install -g http-server

# Expose the desired port
EXPOSE 5967

# Serve the application from the built production files
CMD ["http-server", "dist", "-p", "5967"]
