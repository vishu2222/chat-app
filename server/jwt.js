import jwt from 'jsonwebtoken'

export async function signJwt(data, key) {
  return new Promise((resolve, reject) => {
    jwt.sign(data, key, (err, token) => {
      if (err) {
        reject(err)
      } else {
        resolve(token)
      }
    })
  })
}
