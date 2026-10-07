FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

RUN npm install

COPY . .

WORKDIR /app/backend

RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "dev"]
