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

export async function verifyJwt(token, secretKey) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        reject(err)
      } else {
        resolve(user)
      }
    })
  })
}
