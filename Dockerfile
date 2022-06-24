FROM node:18-alpine

# Set ARGs
ARG TZ=UTC

# Create an app directory
RUN mkdir -p /app
WORKDIR /app

# Copy important parts of the app
COPY ./ /app
RUN rm -rf ./node_modules

# Installing
RUN npm install --production

VOLUME /data

EXPOSE 8293

CMD npm start
