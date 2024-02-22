import express from 'express'
import { PrismaClient } from '@prisma/client'
import generateNewAccessTokenByFreshToken from '../controllers/auth.controller.js'

const prisma = new PrismaClient()
const router = express.Router()

router.post('/token', generateNewAccessTokenByFreshToken)

export default router
