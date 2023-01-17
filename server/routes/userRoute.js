import express from 'express'
import { authorize } from '../controllers/userController.js'
import { userLogout } from '../controllers/userController.js'
import { userLogin, checkUserName, userSignUp } from '../controllers/userController.js'

export const router = express.Router()

router.get('/me', authorize)
router.post('/logout', userLogout)
router.post('/login', userLogin)
router.get('/:name/check', checkUserName)
router.post('/sign-up', userSignUp)
