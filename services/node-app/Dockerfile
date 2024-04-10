FROM node:18
WORKDIR /app
COPY ./node-app/package.json /app

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
    then npm install; \
    else npm install --only-production; \
    fi

COPY ./node-app/ /app
COPY ./_shared/ /app/_shared
RUN npm run build
ENV PORT 3000
EXPOSE $PORT
CMD ["npm", "start"]