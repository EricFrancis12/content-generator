FROM node:18
WORKDIR /app
COPY ./apply-filters-engine/package.json /app

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
    then npm install; \
    else npm install --only-production; \
    fi

COPY ./apply-filters-engine/src/ /app/src
COPY ./apply-filters-engine/package*.json/ /app
COPY ./apply-filters-engine/tsconfig.json /app
COPY ./_shared/ /app/_shared
RUN npm run build
CMD ["npm", "start"]