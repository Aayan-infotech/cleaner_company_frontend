# Stage 1: Build the Angular application
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Build the Angular project in production mode
RUN npm run build -- --configuration production

# Stage 2: Serve the Angular application
FROM node:18-alpine

# Install a lightweight static server
RUN npm install -g http-server

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the build artifacts from the previous stage
COPY --from=build /app/dist /usr/src/app

# Expose the port used by http-server
EXPOSE 5967

# Serve the Angular application
CMD ["http-server", "-p", "5967"]
