FROM node:15
WORKDIR /app
COPY package.json /app

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
    then npm install; \
    else npm install --only-production; \
    fi

COPY . /app
RUN npm run build
ENV PORT 3000
EXPOSE $PORT
CMD ["npm", "start"]