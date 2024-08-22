FROM node:18-alpine

ENV NODE_ENV=production

# Create app directory
WORKDIR /app
COPY package.json .
RUN npm install  --omit=dev
COPY . .

EXPOSE 3000

CMD ["npm", "start"]