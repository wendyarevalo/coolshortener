FROM node:16
WORKDIR /usr/src/app
COPY /coolshortexpress/package*.json ./

RUN npm install
COPY /coolshortexpress .
COPY ../project.env .
EXPOSE 3000
CMD ["node", "app.js"]
