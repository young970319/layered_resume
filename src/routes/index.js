import express from 'express'
import PostsRouter from './PostsRouter.router.js'
import { PrismaClient } from '@prisma/client'

const router = express.Router()

router.use('/posts/', PostsRouter)

export const prisma = new PrismaClient({
    // Prisma를 이용해 데이터베이스를 접근할 때, SQL을 출력해줍니다.
    log: ['query', 'info', 'warn', 'error'],

    // 에러 메시지를 평문이 아닌, 개발자가 읽기 쉬운 형태로 출력해줍니다.
    errorFormat: 'pretty',
}) // PrismaClient 인스턴스를 생성합니다.

export default router

/**
import express from "express";
import UserRouter from "./users.router.js";
import ResumeRouter from "./resumes.router.js";
import AdminRouter from "./admin.router.js";

const router = express.Router();

router.use("/users/", UserRouter);
router.use("/resumes/", ResumeRouter);
router.use("/admin/", AdminRouter);

export default router;

 * 
 */
