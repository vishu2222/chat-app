import { verifyJwt } from './jwt.js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') })

export async function authenticateToken(req, res, next) {
  const token = req.cookies.token
  console.log(req.path)
  if (req.path === '/login' || req.path.endsWith('check') || req.path.endsWith('sign-up')) {
    next()
    return
  }
  if (token === undefined) return res.sendStatus(401)
  try {
    const jwtPaylod = await verifyJwt(token, process.env.SECRET_KEY)
    res.userId = jwtPaylod.user_id // attach to req
    next()
  } catch (err) {
    return res.sendStatus(401)
  }
}
