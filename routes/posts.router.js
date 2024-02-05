import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js'
import { prisma } from '../utils/prisma/index.js'

const router = express.Router() // express.Router()를 이용해 라우터를 생성합니다.

// 이력서 생성
router.post('/posts', authMiddleware, async (req, res, next) => {
    const { title, content } = req.body
    const { userId } = req.user

    const post = await prisma.posts.create({
        data: {
            userId: +userId,
            title,
            content,
        },
    })
    // default 는 따로 안적어도 알아서

    return res.status(201).json({ data: post })
})

/** 이력서 목록 조회 API **/
router.get('/posts', async (req, res, next) => {
    let { orderKey, orderValue } = req.query

    if (
        !orderValue ||
        (orderValue.toLowerCase() !== 'asc' &&
            orderValue.toLowerCase() !== 'desc')
    ) {
        orderValue = 'desc'
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
    })

    //orderkey 내가 원하는 userId 를 불러와 ordervalue= desc

    return res.status(200).json({ data: posts })
})

/** 이력서 상세 조회 API **/
router.get('/posts/:postId', async (req, res, next) => {
    const { postId } = req.params
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
    })

    return res.status(200).json({ data: post })
})

/** 이력서 삭제 */
router.delete('/posts/:postId', authMiddleware, async (req, res, next) => {
    const user = req.user
    const postId = req.params.postId

    if (!postId) {
        return res.status(400).json({
            success: false,
            message: 'postId는 필수값입니다.',
        })
    }

    const post = await prisma.posts.findFirst({
        where: {
            postId: Number(postId),
        },
    })

    if (!post) {
        return res.status(400).json({
            success: false,
            message: '존재하지 않는 이력서 입니다.',
        })
    }

    if (post.userId !== user.userId) {
        return res.status(400).json({
            success: false,
            message: '올바르지 않은 요청입니다.',
        })
    }

    await prisma.posts.delete({
        where: {
            postId: Number(postId),
        },
    })

    return res.status(201).json({ message: '삭제 완료되었습니다.' })
})

/** 이력서 수정 */
router.patch('/posts/:postId', authMiddleware, async (req, res, next) => {
    const user = req.user
    const postId = req.params.postId
    const { title, content, status } = req.body

    if (!postId) {
        return res.status(400).json({
            success: false,
            message: 'postId는 필수값 입니다.',
        })
    }

    if (!title) {
        return res.status(400).json({
            success: false,
            message: '제목은 필수값 입니다.',
        })
    }

    if (!content) {
        return res.status(400).json({
            success: false,
            message: '내용은 필수값 입니다.',
        })
    }

    if (!status) {
        return res.status(400).json({
            success: false,
            message: '상태는 필수값 입니다.',
        })
    }

    const post = await prisma.posts.findFirst({
        where: {
            postId: Number(postId),
        },
    })

    if (!post) {
        return res.status(400).json({
            success: false,
            message: '존재하지 않는 이력서 입니다.',
        })
    }

    if (post.userId !== user.userId) {
        return res.status(400).json({
            success: false,
            message: '올바르지 않은 요청입니다.',
        })
    }

    /** 본인이 작성한 이력서임이 확인됨. */
    await prisma.posts.update({
        where: {
            postId: Number(postId),
        },
        data: {
            title,
            content,
            status,
        },
    })

    return res.status(201).json({ message: '게시글 수정이 완료되었습니다.' })
})

/** 강사님 enum 값 안쓰고 String 으로 해결한 코드

if (i['APPLY', 'DROP', 'PASS', 'INTERVIEW1', 'INTERVIEW2', 'FINAL_PASS'].includes(status)){
    return res.status(400).json({
        success: false,
        message: '올바르지 않은 상태값 입니다.',
    })
}
 */

export default router
