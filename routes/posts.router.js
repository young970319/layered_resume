import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { prisma } from '../utils/prisma/index.js';

const router = express.Router(); // express.Router()를 이용해 라우터를 생성합니다.

// 이력서 생성
router.post('/posts', authMiddleware, async (req, res, next) => {
  const { title, content } = req.body;
  const { userId } = req.user;

  const post = await prisma.posts.create({
    data: {
      userId: +userId,
      title,
      content,
    },
  });
  // default 는 따로 안적어도 알아서

  return res.status(201).json({ data: post });
});

/** 이력서 목록 조회 API **/
router.get('/posts', async (req, res, next) => {
  let { orderKey, orderValue } = req.query;

  if (
    !orderValue ||
    (orderValue.toLowerCase() !== 'asc' && orderValue.toLowerCase() !== 'desc')
  ) {
    orderValue = 'desc';
  }

  // 연산자 우선순위 && > ||
  // orderKey, orderValue 를 사용하여 관련된 모든 정보 꺼내오기
  const posts = await prisma.posts.findMany({
    where: {
      userId: +orderKey,
    },
    select: {
      user: {
        select: {
          name: true,
        }, // user의 name을 찾아줘
      },
      postId: true,
      title: true,
      status: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: orderValue.toLowerCase(), // 게시글을 최신순으로 정렬합니다./
    },
  });

  //orderkey 내가 원하는 userId 를 불러와 ordervalue= desc

  return res.status(200).json({ data: posts });
});

/** 이력서 상세 조회 API **/
router.get('/posts/:postId', async (req, res, next) => {
  const { postId } = req.params;
  const post = await prisma.posts.findFirst({
    where: {
      postId: +postId,
    },
    select: {
      postId: true,
      userId: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.status(200).json({ data: post });
});

/** 이력서 삭제 */
router.delete('/posts/:postId', authMiddleware, async (req, res, next) => {});

/** 이력서 수정 */
router.patch('/posts/:postId', authMiddleware, async (req, res, next) => {
  // 누구의 몇번째 이력서?
  try {
    const { userId } = req.user;
    const { postId } = req.params;
    const updatedData = req.body;

    if (postId) {
    }
    // title : updatedData.title
    // context : updatedData.context
    // status : updatedData.status
  } catch (err) {
    next(err);
  }
});

export default router;
