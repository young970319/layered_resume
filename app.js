import express from 'express';
import mysql from 'mysql2';
import PostsRouter from './routes/posts.router.js';
import UsersRouter from './routes/users.router.js';
import cookieParser from 'cookie-parser';
import authMiddleware from './middlewares/auth.middleware.js';

// const connect = mysql.createConnection({
//   host: 'express-database.cxsq8y2ecev5.ap-northeast-2.rds.amazonaws.com', // AWS RDS 엔드포인트
//   user: 'root', // AWS RDS 계정 명
//   password: 'aaaa4321', // AWS RDS 비밀번호
//   database: 'express_db', // 연결할 MySQL DB 이름
// });

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use('/api', [UsersRouter, PostsRouter]);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
