import pg from 'pg'

const { Pool } = pg
const pool = new Pool({
  user: 'vishu',
  host: 'localhost',
  database: 'chatdb',
  password: '12345',
  port: 5432
})

export async function checkUserNameExists(userName) {
  const client = await pool.connect()
  const res = await client.query(
    `SELECT user_name from users WHERE user_name ='${userName}';`
  )
  client.release()
  if (res.rowCount > 0) {
    return true
  }
  return false
}

export async function signUp(userName, password) {
  const client = await pool.connect()
  const res =
    await client.query(`INSERT INTO users(user_id, user_name, password) 
    VALUES (NEXTVAL('user_id_seq'), '${userName}', '${password}')`)
  client.release()
  if (res.rowCount < 1) throw Error
}

export async function getPassword(userName) {
  const client = await pool.connect()
  const res = await client.query(
    `SELECT password FROM users where user_name = '${userName}'`
  )
  client.release()
  return await res.rows[0].password
}

async function getUserRooms(userName) {
  const client = await pool.connect()
  const userRooms = `SELECT DISTINCT room 
                     FROM 
                        ( 
                        SELECT room 
                        FROM conversations, rooms, users 
                        WHERE conversations.sender_id=users.user_id 
                        AND conversations.room_id=rooms.room_id 
                        AND users.user_name='${userName}'
                        )  AS filteredTable; `
  let res = await client.query(userRooms)
  const roomsList = res.rows.map((item) => item.room)
  client.release()
  return roomsList
}

async function getRoomChat(room) {
  const client = await pool.connect()
  const roomChat = `SELECT user_name, room, msg_txt, msg_time 
    FROM conversations, rooms, users
    WHERE conversations.sender_id=users.user_id 
    AND conversations.room_id=rooms.room_id 
    AND rooms.room = '${room}'
    ORDER BY msg_time ASC LIMIT 10;`
  const res = await client.query(roomChat)
  client.release()
  return res.rows
}

export async function getUserChatByRooms(userName) {
  const userMsgsByRoom = {}
  const roomsList = await getUserRooms(userName)
  for (let room of roomsList) {
    userMsgsByRoom[room] = await getRoomChat(room)
  }
  return userMsgsByRoom
}

// console.log(await getUserChatByRooms('aaaa'))

// INSERT INTO rooms(room_id,room) VALUES ((nextval('room_id_seq')),'demo');

// msgs
// select user_name, room, msg_txt, msg_time from conversations, rooms, users where conversations.sender_id=users.user_id and conversations.room_id=rooms.room_id and users.user_name='aaaa';

// distinct rooms
// SELECT DISTINCT room from (SELECT user_name, room, msg_txt, msg_time FROM conversations, rooms, users WHERE conversations.sender_id=users.user_id AND conversations.room_id=rooms.room_id AND users.user_name='aaaa') AS filteredTable;
