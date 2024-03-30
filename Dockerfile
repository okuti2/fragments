# Build the fragments microservice Back-end API using Node.js
###################################################################################################################
# Stage 0: install base dependencies
# Use node version 20.11.1
FROM node:20.11.1@sha256:f3299f16246c71ab8b304d6745bb4059fa9283e8d025972e28436a9f9b36ed24 AS dependencies

LABEL maintainer="Olutoyosi Kuti <okuti2@myseneca.ca>"\
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

COPY package*.json /app/

# Install node dependencies defined in package-lock.json
RUN npm install

##################################################################################################
# Stage 1: build the fragments microservice

FROM node:20.11.1-alpine@sha256:c0a3badbd8a0a760de903e00cedbca94588e609299820557e72cba2a53dbaa2c

# Use /app as our working directory
WORKDIR /app

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Copy src to /app/src/
COPY ./src ./src

COPY --from=dependencies /app /app

# Start the container by running our server
CMD ["npm", "start"]

# We run our service on port 8080
EXPOSE 8080

# Provide a health check on the server in the container
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl --fail localhost || exit 1