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

export async function getUserName(id) {
  const res = await client.query('SELECT user_name  FROM users WHERE user_id = $1', [id])
  if (res.rows.length === 0) return null
  return res.rows[0].user_name
}

export async function addMsg(msg) {
  const res = await client.query(
    "INSERT INTO messages (msg_id, msg_txt, msg_time, sender_id, room_id) VALUES (nextval('msg_id_seq'), $1, to_timestamp($2/1000.0), $3, $4)",
    [msg.msg_txt, msg.msg_time, msg.user_id, msg.room_id]
  )
  return res.rowCount
}

export async function joinUserToRoom(room, user_id) {
  let res = await client.query('SELECT room_id FROM rooms WHERE room_name = $1', [room])
  if (res.rows.length === 0) return 404 // room doesnt exist
  const roomId = res.rows[0].room_id
  try {
    res = await client.query('INSERT INTO userrooms (user_id, room_id) VALUES ($1 , $2)', [
      user_id,
      roomId
    ])
    return 200
  } catch (err) {
    return 403 // conflict user already a member of the room
  }
}

export async function createNewRoom(room, userId) {
  try {
    const res = await client.query(
      "INSERT INTO rooms (room_id, room_name) VALUES (NEXTVAL('room_id_seq'), $1)",
      [room]
    )
  } catch (err) {
    return 403 //  room already exists
  }

  try {
    let res = await client.query('SELECT room_id FROM rooms WHERE room_name=$1', [room])
    const roomId = res.rows[0].room_id

    res = await client.query('INSERT INTO userrooms(user_id, room_id) VALUES($1, $2)', [
      userId,
      roomId
    ])
    return 200
  } catch (err) {
    return 500
  }
}

//
//
//
//
//
//
//
//
// setInterval(() => {
//   console.log(`Idle count: ${pool.idleCount}`)
//   pool.release(pool.idleCount);
// }, 3000)

// pool.on('release', (client) => {
//   console.log('Client released from the pool due to idle timeout')
// })
