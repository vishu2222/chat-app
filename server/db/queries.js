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
    const res = await client.query(`SELECT user_name from users WHERE user_name ='${userName}';`)
    client.release()
    if (res.rowCount > 0) {
        return true
    }
    return false
}

export async function signUp(userName, password) {
    const client = await pool.connect()
    const res = await client.query(`INSERT INTO users(user_id, user_name, password) 
    VALUES (NEXTVAL('user_id_seq'), '${userName}', '${password}')`)
    client.release()
    if (res.rowCount < 1) throw Error
}

export async function getPassword(userName) {
    const client = await pool.connect()
    const res = await client.query(`SELECT password FROM users where user_name = '${userName}'`)
    client.release()
    return await res.rows[0].password
}