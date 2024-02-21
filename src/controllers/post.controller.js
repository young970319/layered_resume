import { PostsService } from '../services/posts.service.js'

// Post의 컨트롤러(Controller)역할을 하는 클래스
export class PostsController {
    postsService = new PostsService() // Post 서비스를 클래스를 컨트롤러 클래스의 멤버 변수로 할당합니다.

    // 이력서 생성
    createPost = async (req, res, next) => {
        try {
            const { userId, title, content } = req.body

            // 서비스 계층에 구현된 createPost 로직을 실행합니다.
            const createdPost = await this.postsService.createPost(
                userId,
                title,
                content
            )

            return res.status(201).json({
                data: createdPost,
                message: '이력서가 생성되었습니다.',
            })
        } catch (err) {
            next(err)
        }
    }

    // 이력서 조회
    getPosts = async (req, res, next) => {
        try {
            const { orderKey, orderValue } = req.query
            // 서비스 계층에 구현된 findAllPosts 로직을 실행합니다.
            const posts = await this.postsService.findAllPosts(
                orderKey,
                orderValue
            )

            return res.status(200).json({ data: posts })
        } catch (err) {
            next(err)
        }
    }

    // 이력서 상세조회
    getPostById = async (req, res, next) => {
        try {
            const { postId } = req.params

            // 서비스 계층에 구현된 findPostById 로직을 실행합니다.
            const post = await this.postsService.findPostById(postId)

            return res.status(200).json({ data: post })
        } catch (err) {
            next(err)
        }
    }

    // 이력서 수정
    updatePost = async (req, res, next) => {
        try {
            const { postId } = req.params
            const { title, content, status } = req.body

            // 서비스 계층에 구현된 updatePost 로직을 실행합니다.
            const updatedPost = await this.postsService.updatePost(
                postId,
                title,
                content,
                status
            )

            return res.status(200).json({
                data: updatedPost,
                message: '이력서가 수정되었습니다.',
            })
        } catch (err) {
            next(err)
        }
    }

    // 이력서 삭제
    deletePost = async (req, res, next) => {
        try {
            const { postId } = req.params

            // 서비스 계층에 구현된 deletePost 로직을 실행합니다.
            const deletedPost = await this.postsService.deletePost(postId)

            return res.status(200).json({ data: deletedPost })
        } catch (err) {
            next(err)
        }
    }
}
