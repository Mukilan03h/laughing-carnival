FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# We'll serve the development server for now to make it easier to work with
CMD ["npm", "start"]
