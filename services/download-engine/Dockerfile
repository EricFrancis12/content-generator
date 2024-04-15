FROM node:18
WORKDIR /app
COPY ./download-engine/package.json /app

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
    then npm install; \
    else npm install --only-production; \
    fi

COPY ./download-engine/src/ /app/src
COPY ./download-engine/package*.json /app/
COPY ./download-engine/tsconfig.json /app/
COPY ./_shared/ /app/_shared
RUN npm run build
CMD ["npm", "start"]