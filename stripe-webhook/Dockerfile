FROM node:16.13
WORKDIR /usr/src/app
COPY * /usr/src/app/
RUN npm install
COPY . .
# RUN npm start
CMD ["node", "./route.js"]