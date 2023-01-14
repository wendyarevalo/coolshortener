FROM node:16
WORKDIR /usr/src/app
COPY /coolshortkoa/package*.json ./

RUN npm install
COPY /coolshortkoa .
COPY ../project.env .
EXPOSE 3001
CMD ["node", "app.js"]