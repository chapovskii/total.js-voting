# Use the official Node.js image as the base image
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package.json package-lock.json ./

# Install app dependencies
RUN npm install

# Copy all files from the current directory to the container's working directory
COPY . .

# Start the React app when the container runs
CMD ["npm", "start"]