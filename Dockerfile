FROM node:22-alpine AS server
WORKDIR /app/server
COPY server/package.json ./
RUN npm install
COPY server .
EXPOSE 4000
CMD ["npm", "start"]
