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

const client = await pool.connect() // may not handle idle clients

//  checkUserNameExists
export async function isUserNameAvailable(userName) {
  const res = await client.query('SELECT user_name from users WHERE user_name = $1', [userName])
  if (res.rowCount === 1) return true
  return false
}

export async function signUp(userName, password) {
  const res = await client.query(
    "INSERT INTO users(user_id, user_name, password)  VALUES (NEXTVAL('user_id_seq'), $1, $2)",
    [userName, password]
  )
  if (res.rowCount < 1) throw Error
}

export async function getUserInfo(userName) {
  const res = await client.query('SELECT * FROM users WHERE user_name=$1', [userName])
  if (res.rows.length === 0) return 404
  return res.rows[0]
}

export async function getRoomsList(user_id) {
  const res = await client.query(
    'SELECT rooms.room_id, rooms.room_name  FROM userrooms LEFT JOIN rooms ON rooms.room_id = userrooms.room_id WHERE user_id=$1',
    [user_id]
  )
  return res.rows
}

export async function getGeneralRoomMsgs() {
  const res = await client.query(
    'SELECT msg_id, msg_txt, msg_time, user_name FROM messages LEFT JOIN users ON messages.sender_id = users.user_id WHERE messages.room_id=$1',
    [1]
  )
  return res.rows
}

export async function getRoomMsgs(room_id) {
  const res = await client.query(
    'SELECT msg_id, msg_txt, msg_time, user_name FROM messages LEFT JOIN users ON messages.sender_id = users.user_id WHERE messages.room_id=$1',
    [room_id]
  )
  return res.rows
}

// async function getRoomsList(user_id) {
//   const query = `SELECT room_id
//                  FROM userrooms
//                  WHERE user_id=${user_id};`
//   const res = await client.query(query)
//   if (res.rows.length === 0) return []
//   return res.rows.map((item) => item.room_id)
// }

// async function getRoomChat(room_id) {
//   const roomChat = `SELECT  msg_txt, msg_time, user_name, room_name
//                     FROM messages, users, rooms
//                     WHERE messages.room_id = '${room_id}'
//                     AND messages.sender_id = users.user_id
//                     AND rooms.room_id = messages.room_id
//                     ORDER BY msg_time ASC LIMIT 10;`
//   const res = await client.query(roomChat)
//   return res.rows
// }

// export async function getChatByRoom(userName) {
//   const id = await getUserId(userName)

//   if (id === null) return 404
//   const roomsList = await getRoomsList(id)

//   const userMsgsByRoom = {}
//   for (const room_id of roomsList) {
//     userMsgsByRoom[room_id] = await getRoomChat(room_id)
//   }
//   return userMsgsByRoom
// }

export async function addMsg(msg) {
  // const userId = await getUserId(msg.user_name)
  // client.query(
  //   "INSERT INTO messages (msg_id, msg_txt, msg_time, sender_id, room_id) VALUES (nextval('msg_id_seq'), $1, $2, $3, $4)",
  //   [msg.msg_txt, msg.msg_time, userId, msg.roomId]
  // )
  // client.query(
  //   `INSERT INTO messages (msg_id, msg_txt, msg_time, sender_id, room_id)
  //    VALUES (nextval('msg_id_seq'), '${msg.msg_txt}', to_timestamp(${msg.msg_time}), '${userId}', '${msg.roomId}' );`
  // )
}

// client.query(
//   "INSERT INTO messages (msg_id, msg_txt, msg_time, sender_id, room_id) VALUES (nextval('msg_id_seq'), $1, $2, $3, $4)",
//   [msg.msg_txt, msg.msg_time, userId, msg.roomId]
// )

// ((msg_id, msg_txt, msg_time, sender_id, room_id) VALUES (nextval(\'msg_id_seq\'), to_timestamp(' + msg.msg_time + '), $1, $2, $3'

// const result = await client.query(
//   'UPDATE users SET name = $1, email = $2 WHERE id = $3',
//   [name, email, id]
// );

// INSERT INTO messages(msg_id, msg_txt, msg_time, sender_id, room_id) values (NEXTVAL('msg_id_seq'), 'hiA',to_timestamp(1672986759942),1,1);
// const query =
//   'INSERT INTO my_table (timestamp_column) VALUES (to_timestamp(' + currentTimestamp + '))'

// "INSERT INTO messages (msg_id, msg_txt, msg_time, sender_id, room_id) VALUES (nextval('msg_id_seq'), to_timestamp(" +
//   msg.msg_time +
//   '))'

// ((msg_id, msg_txt, msg_time, sender_id, room_id) VALUES (nextval(\'msg_id_seq\'), to_timestamp(' + msg.msg_time + '), $1, $2, $3'

// setInterval(() => {
//   console.log(`Idle count: ${pool.idleCount}`)
//   pool.release(pool.idleCount);
// }, 3000)

// pool.on('release', (client) => {
//   console.log('Client released from the pool due to idle timeout')
// })

// export async function getPassword(userName) {
//   const res = await client.query('SELECT password FROM users where user_name = $1', [userName])
//   return await res.rows[0].password
// }

// async function getUserId(userName) {
//   const res = await client.query('SELECT user_id FROM users WHERE user_name = $1', [userName])
//   if (res.rows.length === 0) return null
//   return res.rows[0].user_id
// }
