import pg from 'pg'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd().split('models')[0], '.env') })

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DB_CONN_STRING,
  ssl: {
    rejectUnauthorized: false
  }
})

const queries = `DROP SCHEMA IF EXISTS chat CASCADE;
create schema chat;

CREATE SEQUENCE chat.msg_id_seq;
CREATE SEQUENCE chat.room_id_seq;
CREATE SEQUENCE chat.user_id_seq;

-- create tables
CREATE TABLE chat.rooms(
  room_id SERIAL PRIMARY KEY,
  room_name VARCHAR NOT NULL
);

CREATE TABLE chat.users(
   user_id SERIAL PRIMARY KEY,
   user_name VARCHAR NOT NULL UNIQUE,
   password VARCHAR NOT NULL ,
   join_date TIMESTAMP
);

CREATE TABLE chat.messages(
    msg_id SERIAL PRIMARY KEY,
    msg_txt VARCHAR NOT NULL,
    msg_time TIMESTAMP NOT NULL,
    sender_id INTEGER,
    room_id INTEGER,
    room_msg BOOLEAN DEFAULT false,
    CONSTRAINT fk_user FOREIGN KEY(sender_id) REFERENCES chat.users(user_id),
    CONSTRAINT fk_room FOREIGN KEY(room_id) REFERENCES chat.rooms(room_id)
);

CREATE TABLE chat.userRooms(
   user_id INTEGER,
   room_id INTEGER,
   removed BOOLEAN,
   PRIMARY KEY (user_id, room_id),
   join_date TIMESTAMP default now(),
   CONSTRAINT fk2_user FOREIGN KEY(user_id) REFERENCES chat.users(user_id),
   CONSTRAINT fk2_room FOREIGN KEY(room_id) REFERENCES chat.rooms(room_id)
);

`

async function ddl() {
  const res = await pool.query(queries)
  console.log(res)
  console.log('done')
}

// ddl()

async function test() {
  const res = await pool.query('select * from chat.userrooms')
  // console.log('done')
  console.log(res.rows)
}

// test()

// INSERT INTO chat.users (user_id, user_name, password) VALUES ((NEXTVAL('chat.user_id_seq')), 'user1', '12345');
// INSERT INTO chat.users (user_id, user_name, password) VALUES ((NEXTVAL('chat.user_id_seq')), 'user2', '12345');
// INSERT INTO chat.users (user_id, user_name, password) VALUES ((NEXTVAL('chat.user_id_seq')), 'user3', '12345');
// INSERT INTO chat.users (user_id, user_name, password) VALUES ((NEXTVAL('chat.user_id_seq')), 'user4', '12345');

// INSERT INTO chat.rooms (room_id, room_name) VALUES ((NEXTVAL('chat.room_id_seq')), 'general');
// INSERT INTO chat.rooms (room_id, room_name) VALUES ((NEXTVAL('chat.room_id_seq')), 'discussions');

// INSERT INTO chat.messages (msg_id, msg_txt, msg_time, sender_id, room_id) VALUES ((NEXTVAL('chat.msg_id_seq')), 'Hi', CURRENT_TIMESTAMP,1,1);
// INSERT INTO chat.messages (msg_id, msg_txt, msg_time, sender_id, room_id) VALUES ((NEXTVAL('chat.msg_id_seq')), 'Hello', CURRENT_TIMESTAMP,2,1);
// INSERT INTO chat.messages (msg_id, msg_txt, msg_time, sender_id, room_id) VALUES ((NEXTVAL('chat.msg_id_seq')), 'wassup', CURRENT_TIMESTAMP,1,1);
// INSERT INTO chat.messages (msg_id, msg_txt, msg_time, sender_id, room_id) VALUES ((NEXTVAL('chat.msg_id_seq')), 'hi everyone', CURRENT_TIMESTAMP,3,1);
// INSERT INTO chat.messages (msg_id, msg_txt, msg_time, sender_id, room_id) VALUES ((NEXTVAL('chat.msg_id_seq')), 'hello there?', CURRENT_TIMESTAMP,4,2);
// INSERT INTO chat.messages (msg_id, msg_txt, msg_time, sender_id, room_id) VALUES ((NEXTVAL('chat.msg_id_seq')), 'hi there?', CURRENT_TIMESTAMP,1,2);

// INSERT INTO chat.userrooms ( user_id, room_id) VALUES ( 1,1);
// INSERT INTO chat.userrooms ( user_id, room_id) VALUES ( 2,1);
// INSERT INTO chat.userrooms ( user_id, room_id) VALUES ( 3,1);
// INSERT INTO chat.userrooms ( user_id, room_id) VALUES ( 4,2);
// INSERT INTO chat.userrooms ( user_id, room_id) VALUES ( 1,2);
