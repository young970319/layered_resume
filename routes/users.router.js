import express from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma/index.js';
import bcrypt from 'bcrypt';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

/** 사용자 회원가입 API **/
router.post('/sign-up', async (req, res, next) => {
  const { email, password, passwordCheck, name } = req.body;
  const isExistUser = await prisma.users.findFirst({
    where: {
      email,
    },
  });

  if (isExistUser) {
    return res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
  }

  if (password !== passwordCheck || password.length < 6) {
    return res.status(400).json({
      message:
        '비밀번호 확인이 일치하지 않거나 비밀번호 길이가 짧습니다. 6자 이상으로 입력해주세요.',
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Users 테이블에 사용자를 추가합니다.
  const user = await prisma.users.create({
    data: { email, password: hashedPassword, name },
  });

  return res.status(201).json({ message: '회원가입이 완료되었습니다.' });
});

// 로그인 하기 위한 데이터 가져오기
// 이메일이 일치 x 에러
// 암호화된 비밀번호 해석
// 비밀번호 일치 x 에러
// 확인이 됐으면 jwt accesstoken 반환 (accesstoken 은 userId 가 담겨있고 유효시간 12시간)

/** 로그인 API **/
router.post('/sign-in', async (req, res, next) => {
  const { email, password } = req.body;
  const user = await prisma.users.findFirst({ where: { email } });

  if (!user)
    return res.status(401).json({ message: '존재하지 않는 이메일입니다.' });
  // 입력받은 사용자의 비밀번호와 데이터베이스에 저장된 비밀번호를 비교합니다.
  else if (!(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });

  // 로그인에 성공하면, 사용자의 userId를 바탕으로 토큰을 생성합니다.
  const token = jwt.sign(
    //json 데이터 암호화
    {
      userId: user.userId,
    },
    process.env.JWT_key,
    { expiresIn: '12h' } //유효시간 12시간
  );

  // authotization 쿠키에 Bearer 토큰 형식으로 JWT를 저장합니다.
  res.cookie('authorization', `Bearer ${token}`);
  return res.status(200).json({ message: '로그인 성공' });
});

/** 내정보 조회 API **/
router.get('/users', authMiddleware, async (req, res, next) => {
  const { userId } = req.user;

  const user = await prisma.users.findFirst({
    where: { userId: +userId },
    select: {
      userId: true,
      email: true,
    },
  });

  return res.status(200).json({ data: user });
});

export default router;
