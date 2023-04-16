import pg from 'pg'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') })

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DB_CONN_STRING,
  ssl: {
    rejectUnauthorized: false
  }
})

async function runQuery(query, params) {
  const client = await pool.connect()
  const res = await client.query(query, params)
  client.release()
  return res
}

export async function isUserNameAvailable(userName) {
  const query = `SELECT user_name from chat.users 
                 WHERE user_name = $1`
  const params = [userName]
  const res = await runQuery(query, params)
  if (res.rowCount === 1) return 'not-available'
  return 'available'
}

export async function signUp(userName, password) {
  const query = `INSERT INTO chat.users(user_id, user_name, password)  
                 VALUES (NEXTVAL('chat.user_id_seq'), $1, $2)`
  const params = [userName, password]
  const res = await runQuery(query, params)
  if (res.rowCount < 1) throw Error
}

export async function getUserCredentials(userName) {
  const query = `SELECT * FROM chat.users 
                 WHERE user_name=$1`
  const params = [userName]
  const res = await runQuery(query, params)
  if (res.rows.length === 0) return 404
  return res.rows[0]
}

export async function getRoomsList(user_id) {
  const query = `SELECT rooms.room_id, rooms.room_name 
                 FROM chat.userrooms
                 LEFT JOIN chat.rooms 
                 ON rooms.room_id = userrooms.room_id 
                 WHERE user_id=$1`
  const params = [user_id]
  const res = await runQuery(query, params)
  return res.rows
}

// console.log(await pool.query('select * from chat.userrooms'))

// console.log(await getRoomsList(1))

export async function getGeneralRoomMsgs() {
  const query = `SELECT msg_id, msg_txt, msg_time, user_name
                 FROM chat.messages 
                 LEFT JOIN chat.users 
                 ON messages.sender_id = users.user_id 
                 WHERE messages.room_id=$1 
                 order by msg_time`
  const params = [1]
  const res = await runQuery(query, params)

  return res.rows
}

// console.log(await getGeneralRoomMsgs())

export async function getRoomMsgs(room_id, userId) {
  const query1 = `SELECT join_date 
                  FROM chat.userrooms
                  WHERE user_id=$1 AND room_id=$2`
  const params1 = [userId, room_id]
  let joinDate = await runQuery(query1, params1)
  // console.log('joinDate', joinDate.rows)

  joinDate = joinDate.rows[0].join_date

  const query2 = `SELECT msg_id, msg_txt, msg_time, user_name 
                  FROM chat.messages 
                  LEFT JOIN chat.users 
                  ON messages.sender_id = users.user_id 
                  WHERE messages.room_id=$1 AND msg_time > $2 
                  ORDER BY msg_time`
  const params2 = [room_id, joinDate]
  const res = await runQuery(query2, params2)

  return res.rows
}
// console.log(await getRoomMsgs(1, 5))

export async function getUserName(id) {
  const query = `SELECT user_name  
                 FROM chat.users 
                 WHERE user_id = $1`
  const params = [id]
  const res = await runQuery(query, params)
  if (res.rows.length === 0) return null
  return res.rows[0].user_name
}

// console.log(await getUserName(1))

export async function getUserId(userName) {
  const query = `SELECT user_id  
                 FROM chat.users
                 WHERE user_name = $1`
  const params = [userName]
  const res = await runQuery(query, params)
  return res.rows[0].user_id
}

// console.log(await getUserId('user1'))

//  room_msg $5  msg.roomMsg
export async function addMsg(msg) {
  const query = `INSERT INTO chat.messages (msg_id, msg_txt, msg_time, sender_id, room_id)
                 VALUES (nextval('chat.msg_id_seq'), $1, to_timestamp($2/1000.0), $3, $4)`
  const params = [msg.msg_txt, msg.msg_time, msg.user_id, msg.room_id]
  const res = await runQuery(query, params)

  if (res.rowCount !== 1) return 500
  return 201
}

export async function joinUserToRoom(room, user_id) {
  const client = await pool.connect()
  let res = await client.query(`SELECT room_id FROM chat.rooms WHERE room_name = $1`, [room])
  if (res.rows.length === 0) return 404 // room doesnt exist
  const roomId = res.rows[0].room_id
  try {
    res = await client.query(
      `INSERT INTO chat.userrooms (user_id, room_id, join_date) VALUES ($1 , $2, to_timestamp($3/1000.0))`,
      [user_id, roomId, Date.now()]
    )
    return 200
  } catch (err) {
    return 409 // conflict user already a member of the room
  } finally {
    client.release()
  }
}

// console.log(await joinUserToRoom(1, 4)) // chat. ????

export async function createNewRoom(room, userId) {
  const client = await pool.connect()
  try {
    const res = await client.query(
      `INSERT INTO chat.rooms (room_id, room_name) VALUES (NEXTVAL('chat.room_id_seq'), $1)`,
      [room]
    )
  } catch (err) {
    return 403 //  room already exists
  }

  try {
    let res = await client.query(`SELECT room_id FROM chat.rooms WHERE room_name=$1`, [room])
    const roomId = res.rows[0].room_id

    res = await client.query(
      `INSERT INTO chat.userrooms(user_id, room_id, join_date) VALUES($1, $2, to_timestamp($3/1000.0))`,
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
