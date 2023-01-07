import pg from 'pg'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') })

const { Pool } = pg
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
})

// drop seq
const dropMsgIdSeq = 'DROP SEQUENCE msg_id_seq;'
const dropRoomIdSeq = 'DROP SEQUENCE room_id_seq;'
const dropUserIdSeq = 'DROP SEQUENCE user_id_seq;'
const dropUserGroupIdSeq = 'DROP SEQUENCE userGroup_id_seq;'

// drop tables
const dropMessages = 'DROP TABLE messages CASCADE;'
const dropUsers = 'DROP TABLE users CASCADE;'
const dropRooms = 'DROP TABLE rooms CASCADE;'
const dropuserRooms = 'DROP TABLE userRooms CASCADE;'

// create seq
const msgIdSeq = 'CREATE SEQUENCE msg_id_seq;'
const roomIdSeq = 'CREATE SEQUENCE room_id_seq;'
const userIdSeq = 'CREATE SEQUENCE user_id_seq;'
const userGroupIdSeq = 'CREATE SEQUENCE userGroup_id_seq;'

// create tables
const rooms = `CREATE TABLE rooms(
  room_id SERIAL PRIMARY KEY,
  room_name VARCHAR NOT NULL
);`

const users = `CREATE TABLE users(
  user_id SERIAL PRIMARY KEY,
  user_name VARCHAR NOT NULL,
  password VARCHAR NOT NULL
);`

const messages = `CREATE TABLE messages(
    msg_id SERIAL PRIMARY KEY,
    msg_txt VARCHAR NOT NULL,
    msg_time TIMESTAMP NOT NULL,
    sender_id INTEGER,
    room_id INTEGER,
    CONSTRAINT fk_user FOREIGN KEY(sender_id) REFERENCES users(user_id),
    CONSTRAINT fk_room FOREIGN KEY(room_id) REFERENCES rooms(room_id)
);`

const userRooms = `CREATE TABLE userRooms(
  id serial PRIMARY KEY,
  user_id INTEGER,
  room_id INTEGER,
  removed BOOLEAN,
  CONSTRAINT fk2_user FOREIGN KEY(user_id) REFERENCES users(user_id),
  CONSTRAINT fk2_room FOREIGN KEY(room_id) REFERENCES rooms(room_id)
);`
// add default true to removed

async function setUpDB() {
  const client = await pool.connect()
  // drop seq
  client.query(dropMsgIdSeq, responseHandler)
  client.query(dropRoomIdSeq, responseHandler)
  client.query(dropUserIdSeq, responseHandler)
  client.query(dropUserGroupIdSeq, responseHandler)
  // drop tables
  client.query(dropMessages, responseHandler)
  client.query(dropUsers, responseHandler)
  client.query(dropRooms, responseHandler)
  client.query(dropuserRooms, responseHandler)
  // create seq
  client.query(msgIdSeq, responseHandler)
  client.query(roomIdSeq, responseHandler)
  client.query(userIdSeq, responseHandler)
  client.query(userGroupIdSeq, responseHandler)
  // create tables
  client.query(rooms, responseHandler)
  client.query(users, responseHandler)
  client.query(messages, responseHandler)
  client.query(userRooms, responseHandler)

  client.release()
}

function responseHandler(err, res) {
  if (err) {
    console.log(err)
  }
}

await setUpDB()

// sample inserts
const user1 = `INSERT INTO users (user_id, user_name, password) VALUES ((NEXTVAL('user_id_seq')), 'vish', '12345');`
const user2 = `INSERT INTO users (user_id, user_name, password) VALUES ((NEXTVAL('user_id_seq')), 'user2', '12345');`
const user3 = `INSERT INTO users (user_id, user_name, password) VALUES ((NEXTVAL('user_id_seq')), 'user3', '12345');`
const user4 = `INSERT INTO users (user_id, user_name, password) VALUES ((NEXTVAL('user_id_seq')), 'uuer4', '12345');`

const room1 = `INSERT INTO rooms (room_id, room_name) VALUES ((NEXTVAL('room_id_seq')), 'general');`
const room2 = `INSERT INTO rooms (room_id, room_name) VALUES ((NEXTVAL('room_id_seq')), 'discussions');`

const msg1 = `INSERT INTO messages (msg_id, msg_txt, msg_time, sender_id, room_id) VALUES
              ((NEXTVAL('msg_id_seq')), 'Hi', CURRENT_TIMESTAMP,1,1);`

const msg2 = `INSERT INTO messages (msg_id, msg_txt, msg_time, sender_id, room_id) VALUES
              ((NEXTVAL('msg_id_seq')), 'Hello', CURRENT_TIMESTAMP,2,1);`

const msg3 = `INSERT INTO messages (msg_id, msg_txt, msg_time, sender_id, room_id) VALUES
              ((NEXTVAL('msg_id_seq')), 'wassup', CURRENT_TIMESTAMP,1,1);`

const msg4 = `INSERT INTO messages (msg_id, msg_txt, msg_time, sender_id, room_id) VALUES
              ((NEXTVAL('msg_id_seq')), 'hi everyone', CURRENT_TIMESTAMP,3,1);`

const msg5 = `INSERT INTO messages (msg_id, msg_txt, msg_time, sender_id, room_id) VALUES
              ((NEXTVAL('msg_id_seq')), 'hello there?', CURRENT_TIMESTAMP,4,2);`

const msg6 = `INSERT INTO messages (msg_id, msg_txt, msg_time, sender_id, room_id) VALUES
              ((NEXTVAL('msg_id_seq')), 'hi there?', CURRENT_TIMESTAMP,1,2);`

const userRoom1 = `INSERT INTO userrooms (id, user_id, room_id) VALUES ((NEXTVAL('userGroup_id_seq')), 1,1);`
const userRoom2 = `INSERT INTO userrooms (id, user_id, room_id) VALUES ((NEXTVAL('userGroup_id_seq')), 2,1);`
const userRoom3 = `INSERT INTO userrooms (id, user_id, room_id) VALUES ((NEXTVAL('userGroup_id_seq')), 3,1);`
const userRoom4 = `INSERT INTO userrooms (id, user_id, room_id) VALUES ((NEXTVAL('userGroup_id_seq')), 4,2);`
const userRoom5 = `INSERT INTO userrooms (id, user_id, room_id) VALUES ((NEXTVAL('userGroup_id_seq')), 1,2);`

async function sampleInserts() {
  const client = await pool.connect()
  client.query(user1, responseHandler)
  client.query(user2, responseHandler)
  client.query(user3, responseHandler)
  client.query(user4, responseHandler)

  client.query(room1, responseHandler)
  client.query(room2, responseHandler)

  client.query(msg1, responseHandler)
  client.query(msg2, responseHandler)
  client.query(msg3, responseHandler)
  client.query(msg4, responseHandler)
  client.query(msg5, responseHandler)
  client.query(msg6, responseHandler)

  client.query(userRoom1, responseHandler)
  client.query(userRoom2, responseHandler)
  client.query(userRoom3, responseHandler)
  client.query(userRoom4, responseHandler)
  client.query(userRoom5, responseHandler)

  client.release()
}

await sampleInserts()
// users
// INSERT INTO users (user_id, user_name, password) VALUES ((NEXTVAL('user_id_seq')), 'vish', '12345');

// rooms
// INSERT INTO rooms (room_id, user_name, password) VALUES ((NEXTVAL('user_id_seq')), 'vish', '12345');
// messages

// userrooms

// INSERT INTO conversations(msg_id, msg_txt, msg_time, sender_id, room_id) VALUES ((nextval('msg_id_seq')),'hi',CURRENT_TIMESTAMP,19,1);

// const client = await pool.connect()
// console.log(client)
// console.log(pool.query('SELECT * FROM abc;'))

// const data = await client.query('SELECT NOW()')
