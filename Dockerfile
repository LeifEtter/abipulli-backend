FROM node:alpine AS builder

WORKDIR /backend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:alpine AS production

WORKDIR /backend
COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /backend/dist ./dist

#!Replace approach to migrate!!!
COPY --from=builder /backend/drizzle.config.ts ./
COPY --from=builder /backend/src/db/index.ts ./src/db/index.ts
COPY --from=builder /backend/src/db/schemas ./src/db/schemas

EXPOSE 55116
CMD ["node", "dist/index.js"]