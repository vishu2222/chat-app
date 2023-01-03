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
    `SELECT user_name from users WHERE user_name ='${userName}';` // change the query
  )
  client.release()
  if (res.rowCount === 1) return true
  return false
}

export async function signUp(userName, password) {
  const client = await pool.connect()
  const res =
    await client.query(`INSERT INTO users(user_id, user_name, password) 
    VALUES (NEXTVAL('user_id_seq'), '${userName}', '${password}')`) //
  client.release()
  if (res.rowCount < 1) throw Error //
}

export async function getPassword(userName) {
  const client = await pool.connect()
  const res = await client.query(
    `SELECT password FROM users where user_name = '${userName}'` //
  )
  client.release()
  return await res.rows[0].password
}

async function getUserId(userName) {
  const client = await pool.connect()
  const query = `SELECT user_id FROM users WHERE user_name = '${userName}'`
  const res = await client.query(query)
  if (res.rows.length === 0) return null
  client.release()
  return res.rows[0].user_id
}

async function getRoomsList(user_id) {
  const client = await pool.connect()
  const query = `SELECT room_id
                 FROM userrooms
                 WHERE user_id=${user_id};`
  const res = await client.query(query)
  if (res.rows.length === 0) return []
  client.release()
  return res.rows.map((item) => item.room_id)
}

async function getRoomChat(room_id) {
  const client = await pool.connect()
  const roomChat = `SELECT  msg_txt, msg_time, user_name, room_name
                    FROM messages, users, rooms
                    WHERE messages.room_id = '${room_id}'
                    AND messages.sender_id = users.user_id
                    AND rooms.room_id = messages.room_id
                    ORDER BY msg_time ASC LIMIT 10;`
  const res = await client.query(roomChat)
  client.release()
  return res.rows
}

export async function getUsersChatByRoom(userName) {
  const client = await pool.connect()
  const id = await getUserId(userName)

  if (id === null) return 404
  const roomsList = await getRoomsList(id)

  const userMsgsByRoom = {}
  for (const room_id of roomsList) {
    userMsgsByRoom[room_id] = await getRoomChat(room_id)
  }
  client.release()
  return userMsgsByRoom
}
