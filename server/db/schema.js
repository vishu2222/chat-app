import pg from 'pg'

const { Pool } = pg
const pool = new Pool({
    user: 'vishu',
    host: 'localhost',
    database: 'chatdb',
    password: '12345',
    port: 5432
})

// drop seq
const dropMsgIdSeq = 'DROP SEQUENCE msg_id_seq;'
const dropRoomIdSeq = 'DROP SEQUENCE room_id_seq;'
const dropUserIdSeq = 'DROP SEQUENCE user_id_seq;'

// drop tables
const dropConversations = 'DROP TABLE conversations;'
const dropUsers = 'DROP TABLE users;'
const dropRooms = 'DROP TABLE rooms;'

// create seq
const msgIdSeq = 'CREATE SEQUENCE msg_id_seq;'
const roomIdSeq = 'CREATE SEQUENCE room_id_seq;'
const userIdSeq = 'CREATE SEQUENCE user_id_seq;'

// create tables
const conversations = `CREATE TABLE conversations(
    msg_id SERIAL PRIMARY KEY,
    msg_txt VARCHAR NOT NULL,
    msg_time TIMESTAMP NOT NULL,
    sender_id INTEGER,
    room_id INTEGER,
    CONSTRAINT fk_user FOREIGN KEY(sender_id) REFERENCES users(user_id),
    CONSTRAINT fk_room FOREIGN KEY(room_id) REFERENCES rooms(room_id)
); `

const rooms = `CREATE TABLE rooms(
    room_id SERIAL PRIMARY KEY,
    room VARCHAR NOT NULL
);`

const users = `CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR NOT NULL,
    password VARCHAR NOT NULL
);`


async function setUpDB() {
    const client = await pool.connect()
    // drop seq
    client.query(dropMsgIdSeq, responseHandler);
    client.query(dropRoomIdSeq, responseHandler);
    client.query(dropUserIdSeq, responseHandler);
    // drop tables
    client.query(dropConversations, responseHandler);
    client.query(dropUsers, responseHandler);
    client.query(dropRooms, responseHandler);
    // create seq
    client.query(msgIdSeq, responseHandler);
    client.query(roomIdSeq, responseHandler);
    client.query(userIdSeq, responseHandler);
    // create tables
    client.query(rooms, responseHandler);
    client.query(users, responseHandler);
    client.query(conversations, responseHandler);

    client.release()
}

function responseHandler(err, res) {
    if (err) { console.log(err) }
}

setUpDB()


// const LinkEntity = create table usergroup(id SERIAL PRIMARY KEY, room_id Integer, group_id Integer)

// const client = await pool.connect()
// console.log(client)
// console.log(pool.query('SELECT * FROM abc;'))


// const data = await client.query('SELECT NOW()')