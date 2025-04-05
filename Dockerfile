# Étape 1 : build
FROM node:20 AS builder

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Étape 2 : serveur statique
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
