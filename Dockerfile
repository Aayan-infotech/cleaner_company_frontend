# Step 1: Build the Angular app
FROM node:20 AS build

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the entire project
COPY . .

# Build the Angular app for production
RUN npm run build --prod

# Step 2: Serve the app with Nginx
FROM nginx:stable-alpine

# Copy the built Angular app from the build stage
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Copy a custom Nginx configuration file (if needed)
# Uncomment this if you have a custom nginx.conf
 COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 5967

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
