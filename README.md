# Chat-App

    - Chat Application for sending and recieving messages.
    - Deployed at https://vishus-chat-app.onrender.com
    - Test userName1 userA Test password1  userA
    - Test userName1 userB Test password1  userB

## Features

    - Register new user,
    - login, authentication with json web token
    - create new rooms, join existing rooms,
    - send and recieve messages,
    - notification on users joining and leaving rooms,
    - notification on msg-typying.

## setup

### server

    - npm i jsonwebtoken dotenv bcrypt socket.io express pg cors cookie-parser (or clone the repositoty and npm install)

### client

    - npx create-react-app client and replace the default scaffold
    - npm i socket.io-client react-router-dom

### Setup postgres database schema

    node server/models/schema.js

### Technologies

    - Front-end: React, Socket io Client HTML,CSS
    - Backend: Express, Socket io, postgress

### UI

![chatSnap](https://user-images.githubusercontent.com/90732088/212548606-e6243e48-c37e-4e88-9a65-96f984f46752.png)

## Todo

1. confirm insert in server socket before broadcastMsg // done
2. broad cast on userJoin a room. // done
3. Add a wrapper function to queries. // done
4. handle network errors // done
5. fire event to check username valid after entering userName
6. Add error.code === '23505' => Status(409) in signUp in queries
7. get msgs after joindate // done
8. change psudo class in RoomsContainer.css // done
9. show msg time.
10. socket emit on typing // done
11. private messages
12. list active users
13. save room msgs to db
14. add backend validation as well similar to what is done on frontend.
15. replace testing with userName // done
16. execute last two queries useing wrapper
17. display users and add private messaging
18. persist room on reload
19. deploy on render

- Review:

1. get new room details from post response, dont make fetch room list
2. switch to room on join and create
3. change to MVC // done
4. relevent parts in the header page // done
5. handle different error cases
6. response should always be an object or arr and consistent structure // done
7. create sessions table
8. return strings from db response inplace of statuscodes
9. allow msg screen only after socket connection established
