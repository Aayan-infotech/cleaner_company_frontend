FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package files first for installing dependencies
COPY package*.json ./

# Install project dependencies with the --legacy-peer-deps flag
RUN npm install --legacy-peer-deps

# Copy the entire project to the working directory
COPY . .

# Build the Angular app for production
RUN npm run build

# Install http-server to serve the production build
RUN npm install -g http-server

# Copy the contents of the built Angular app (from dist/coreui-free-angular-admin-template) to the main serving directory
RUN cp -r /usr/src/app/dist/* /usr/src/app/dist/

# Set the working directory to the dist folder (Angular's production build output)
WORKDIR /usr/src/app/dist

# Expose the desired port
EXPOSE 5967

# Serve the application on the specified port
CMD ["http-server", "-p", "5967"]
