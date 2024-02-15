# Build the fragments microservice Back-end API using Node.js

# Use node version 18.17.0
FROM node:18.17.0

LABEL maintainer="Kim Lee <klee@example.com>" \
      description="Fragments node.js microservice"

# We default to use port 8080 in our service
ENV PORT=8080 \

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
   NPM_CONFIG_LOGLEVEL=warn \

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
    NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Option 2: relative path - Copy the package.json and package-lock.json
# files into the working dir (/app).  NOTE: this requires that we have
# already set our WORKDIR in a previous step.
COPY package*.json ./

# Install node dependencies defined in package-lock.json
RUN npm install

# Copy src to /app/src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Start the container by running our server
CMD npm start

# We run our service on port 8080
EXPOSE 8080