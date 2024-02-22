// userRouter.js

import express from 'express'
import userController from './userController'
import authMiddleware from './authMiddleware'

const router = express.Router()

router.post('/sign-up', userController.signUp)
router.post('/sign-in', userController.signIn)
router.get('/users', authMiddleware, userController.getUserInfo)

export default router
