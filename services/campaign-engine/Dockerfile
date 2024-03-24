FROM node:15
WORKDIR /app
COPY ./campaign-engine/package.json /app

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
    then npm install; \
    else npm install --only-production; \
    fi

COPY ./campaign-engine/src/ /app/src
COPY ./campaign-engine/package*.json/ /app
COPY ./campaign-engine/tsconfig.json /app
COPY ./_shared/ /app/_shared
RUN npm run build
CMD ["npm", "start"]