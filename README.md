# Chat-App

- Chat application for sending and recieving messages.

### Features

- Register new user,
- login, authentication with json web token
- create new rooms, join existing rooms,
- send and recieve messages,
- notification on users joining and leaving rooms,
- notification on msg-typying.

### setup

#### server

- npm i jsonwebtoken dotenv bcrypt socket.io express pg cors cookie-parser

#### client

- npx create-react-app client
- npm i socket.io-client react-router-dom

#### db

node server/models/schema.js

### Technologies

- Front-end: React, Socket io Client HTML,CSS
- Backend: Express, Socket io, postgress

![chatSnap](https://user-images.githubusercontent.com/90732088/212546070-98f5c3b9-fa37-49f7-8195-70f7f8fe98eb.png)
