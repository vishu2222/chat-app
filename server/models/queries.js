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

async function runQuery(query, params) {
  const client = await pool.connect()
  const res = await client.query(query, params)
  client.release()
  return res
}

export async function isUserNameAvailable(userName) {
  const query = `SELECT user_name from users 
                 WHERE user_name = $1`
  const params = [userName]
  const res = await runQuery(query, params)
  if (res.rowCount === 1) return true
  return false
}

export async function signUp(userName, password) {
  const query = `INSERT INTO users(user_id, user_name, password)  
                 VALUES (NEXTVAL('user_id_seq'), $1, $2)`
  const params = [userName, password]
  const res = await runQuery(query, params)
  if (res.rowCount < 1) throw Error
}

export async function getUserInfo(userName) {
  const query = `SELECT * FROM users 
                 WHERE user_name=$1`
  const params = [userName]
  const res = await runQuery(query, params)
  if (res.rows.length === 0) return 404
  return res.rows[0]
}

export async function getRoomsList(user_id) {
  const query = `SELECT rooms.room_id, rooms.room_name 
                 FROM userrooms
                 LEFT JOIN rooms 
                 ON rooms.room_id = userrooms.room_id 
                 WHERE user_id=$1`
  const params = [user_id]
  const res = await runQuery(query, params)
  return res.rows
}

export async function getGeneralRoomMsgs() {
  const query = `SELECT msg_id, msg_txt, msg_time, user_name 
                 FROM messages 
                 LEFT JOIN users 
                 ON messages.sender_id = users.user_id 
                 WHERE messages.room_id=$1 
                 order by msg_time`
  const params = [1]
  const res = await runQuery(query, params)

  return res.rows
}

export async function getRoomMsgs(room_id, userId) {
  const query1 = `SELECT join_date 
                  FROM userrooms
                  WHERE user_id=$1 AND room_id=$2`
  const params1 = [userId, room_id]
  let joinDate = await runQuery(query1, params1)

  joinDate = joinDate.rows[0].join_date

  const query2 = `SELECT msg_id, msg_txt, msg_time, user_name 
                  FROM messages 
                  LEFT JOIN users 
                  ON messages.sender_id = users.user_id 
                  WHERE messages.room_id=$1 AND msg_time > $2 
                  ORDER BY msg_time`
  const params2 = [room_id, joinDate]
  const res = await runQuery(query2, params2)

  return res.rows
}

export async function getUserName(id) {
  const query = `SELECT user_name  
                 FROM users 
                 WHERE user_id = $1`
  const params = [id]
  const res = await runQuery(query, params)
  if (res.rows.length === 0) return null
  return res.rows[0].user_name
}

export async function getUserId(userName) {
  const query = `SELECT user_id  
                 FROM users
                 WHERE user_name = $1`
  const params = [userName]
  const res = await runQuery(query, params)
  return res.rows[0].user_id
}

export async function addMsg(msg) {
  const query = `INSERT INTO messages (msg_id, msg_txt, msg_time, sender_id, room_id) 
                 VALUES (nextval('msg_id_seq'), $1, to_timestamp($2/1000.0), $3, $4)`
  const params = [msg.msg_txt, msg.msg_time, msg.user_id, msg.room_id]
  const res = await runQuery(query, params)

  if (res.rowCount !== 1) return 500
  return 201
}

export async function joinUserToRoom(room, user_id) {
  const client = await pool.connect()
  let res = await client.query(`SELECT room_id FROM rooms WHERE room_name = $1`, [room])
  if (res.rows.length === 0) return 404 // room doesnt exist
  const roomId = res.rows[0].room_id
  try {
    res = await client.query(
      `INSERT INTO userrooms (user_id, room_id, join_date) VALUES ($1 , $2, to_timestamp($3/1000.0))`,
      [user_id, roomId, Date.now()]
    )
    return 200
  } catch (err) {
    return 409 // conflict user already a member of the room
  } finally {
    client.release()
  }
}

export async function createNewRoom(room, userId) {
  const client = await pool.connect()
  try {
    const res = await client.query(
      `INSERT INTO rooms (room_id, room_name) VALUES (NEXTVAL('room_id_seq'), $1)`,
      [room]
    )
  } catch (err) {
    return 403 //  room already exists
  }

  try {
    let res = await client.query(`SELECT room_id FROM rooms WHERE room_name=$1`, [room])
    const roomId = res.rows[0].room_id

    res = await client.query(
      `INSERT INTO userrooms(user_id, room_id, join_date) VALUES($1, $2, to_timestamp($3/1000.0))`,
      [userId, roomId, Date.now()]
    )
    return 200
  } catch (err) {
    return 500
  } finally {
    client.release()
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

// const query = ``
// const params = []
// const res = await runQuery(query, params)
