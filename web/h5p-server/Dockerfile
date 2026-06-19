FROM node:20-alpine
WORKDIR /app
COPY package.json download-core.mjs config.json ./
COPY lib ./lib
COPY server.mjs ./
RUN npm install --omit=dev
RUN node download-core.mjs
RUN mkdir -p h5p/content h5p/libraries h5p/temp h5p/user-data
EXPOSE 8088
CMD ["npm", "start"]
