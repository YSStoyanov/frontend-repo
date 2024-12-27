# Използваме официалния Node.js образ
FROM node:14

# Създаваме директория за приложението
WORKDIR /usr/src/app

# Копираме package.json и инсталираме зависимостите
COPY package*.json ./
RUN npm install

# Копираме всички файлове
COPY . .

# ИзExposeваме порта
EXPOSE 3000

# Стартираме приложението
CMD ["npm", "start"]