import { isUserNameAvailable, signUp, getUserId } from '../models/queries.js'
import { joinUserToRoom, getUserCredentials } from '../models/queries.js'
import bcrypt from 'bcrypt'
import { signJwt } from '../utilities/jwt.js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') })
const secretKey = process.env.SECRET_KEY

export async function userNameCheck(req, res) {
  try {
    const response = await isUserNameAvailable(req.params.name)
    if (response === 'available') {
      return res.status(200).json({ available: true })
    }
    return res.status(200).json({ available: false })
  } catch (err) {
    res.sendStatus(500)
  }
}

export async function userSignUp(req, res) {
  try {
    const salt = await bcrypt.genSalt()
    const hashedPwd = await bcrypt.hash(req.body.password, salt)
    await signUp(req.body.userName, hashedPwd)

    const userId = await getUserId(req.body.userName)
    await joinUserToRoom('general', userId)
    res.sendStatus(201)
  } catch (err) {
    res.sendStatus(500)
  }
}

export async function checkUserName(req, res) {
  try {
    const response = await isUserNameAvailable(req.params.name)
    if (response === 'available') {
      return res.status(200).json({ available: true })
    }
    return res.status(200).json({ available: false })
  } catch (err) {
    res.sendStatus(500)
  }
}

export async function userLogin(req, res) {
  try {
    const response = await getUserCredentials(req.body.userName)
    if (response === 404) {
      return res.status(404).json({ err: 'user doesnt exists' })
    }

    const { user_id, user_name: userName, password: dbPassword } = response

    if (await bcrypt.compare(req.body.password, dbPassword)) {
      const claim = { user_id }
      const token = await signJwt(claim, secretKey)

      return res.cookie('token', token, { httpOnly: true }).sendStatus(200)
    }

    return res.status(401).json({ err: 'invalid password', status: 401 })
  } catch (err) {
    res.sendStatus(500)
  }
}

export async function authorize(req, res) {
  //   authenticateToken(req, res)
  // /user/me and return user details
  return res.sendStatus(200)
}

export async function userLogout(req, res) {
  res.clearCookie('token')
  res.sendStatus(200)
}
