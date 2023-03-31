FROM node:lts-buster

RUN apt-get update

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install dependensi
RUN npm install

# Salin seluruh kode aplikasi
COPY . .

# Expose port untuk aplikasi
EXPOSE 3000

# Jalankan aplikasi
CMD ["node", "index"]
