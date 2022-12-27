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


// checkUserNameExists('b').then(res => console.log(res))