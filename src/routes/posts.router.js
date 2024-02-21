import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js'
import { prisma } from './index.js'
import { PostsController } from '../controllers/posts.controller.js'

const router = express.Router() // express.Router()를 이용해 라우터를 생성합니다.

// PostsController의 인스턴스를 생성합니다.
const postsController = new PostsController()

/** 게시글 조회 API **/
router.get('/', postsController.getPosts)

/** 게시글 상세 조회 API **/
router.get('/:postId', postsController.getPostById)

/** 게시글 작성 API **/
router.post('/', postsController.createPost)

/** 게시글 수정 API **/
router.patch('/:postId', postsController.updatePost)

/** 게시글 삭제 API **/
router.delete('/:postId', postsController.deletePost)

export default router
