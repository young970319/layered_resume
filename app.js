import express from 'express'
import mysql from 'mysql2'
import PostsRouter from './routes/posts.router.js'
import UsersRouter from './routes/users.router.js'
import cookieParser from 'cookie-parser'
import authMiddleware from './middlewares/auth.middleware.js'
import dotenv from 'dotenv'
dotenv.config()
// 나 가져온다? 말만하는놈 ; 실행하는 놈

const app = express()
const PORT = 3000

app.use(express.json())
app.use(cookieParser())
app.use('/api', [UsersRouter, PostsRouter])

//app.use('/users', userRouter);
//app.use('/resumes', resumeRouter);

app.listen(PORT, () => {
    console.log(PORT, '포트로 서버가 열렸어요!')
})
