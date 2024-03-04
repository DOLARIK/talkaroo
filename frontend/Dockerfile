# Use the official Node.js LTS image as the base image
FROM node:lts

# Set the working directory in the container
WORKDIR /project

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install
# or use yarn if preferred
# RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that the Next.js app will run on
EXPOSE 3000

# Command to run the development server
CMD ["npm", "run", "dev"]
# or use yarn if preferred
# CMD ["yarn", "dev"]