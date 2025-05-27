
# Base image
FROM node:22-alpine

# Create app directory
WORKDIR /usr/src/app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN yarn install

# Bundle app source
COPY . .

# # Copy the .env and .env.development files
# COPY .env.dev ./

# Creates a "dist" folder with the production build
RUN yarn run build

# Expose the port on which the app will run
EXPOSE 80

# Start the server using the production build
CMD ["npm", "run", "start:prod"]