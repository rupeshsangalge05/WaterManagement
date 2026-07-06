FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

FROM node:20-alpine

RUN npm install -g serve

WORKDIR /app

COPY --from=builder /app/build ./build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]


# FROM node:20-alpine AS builder
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build          # Creates /app/build

# FROM node:20-alpine
# RUN npm install -g serve
# WORKDIR /app
# COPY --from=builder /app/build ./build
# EXPOSE 3000
# CMD ["serve", "-s", "build", "-l", "3000"]  # Serves /build