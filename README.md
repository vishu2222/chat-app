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


![chatSnap](https://user-images.githubusercontent.com/90732088/212548606-e6243e48-c37e-4e88-9a65-96f984f46752.png)
