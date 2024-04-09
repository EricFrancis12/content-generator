FROM node:15
WORKDIR /app
COPY ./cleanup-engine/package.json /app

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
    then npm install; \
    else npm install --only-production; \
    fi

COPY ./cleanup-engine/src/ /app/src
COPY ./cleanup-engine/package*.json /app
COPY ./cleanup-engine/tsconfig.json /app
COPY ./_shared/ /app/_shared
RUN npm run build
CMD ["npm", "start"]