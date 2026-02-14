FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY tsconfig.json ./
COPY migrations ./migrations
COPY src ./src
CMD ["npm", "run", "dev"]
