FROM node:alpine AS builder

WORKDIR /backend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:alpine AS production

WORKDIR /backend
COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /backend/dist ./dist

EXPOSE 55116
CMD ["node", "dist/index.js"]