FROM node:9.11.2
WORKDIR /app

COPY ["./package.json", "./package-lock.json*", "./"]

RUN npm install

COPY . .

CMD ["npm", "run", "build"]

EXPOSE 8100

CMD ["npm", "start"]
