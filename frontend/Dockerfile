FROM node:20-alpine

WORKDIR /app

# Bağımlılıkları önce kopyala (cache optimizasyonu)
COPY package*.json ./
RUN npm ci

# Kaynak kodu kopyala
COPY . .

EXPOSE 3000

# Dev modunda çalıştır
CMD ["npm", "run", "dev"]
