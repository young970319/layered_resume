import { PostsRepository } from '../repositories/posts.repository.js'

export class PostsService {
    postsRepository = new PostsRepository()

    createPost = async (userId, title, content) => {
        // 저장소(Repository)에게 데이터를 요청합니다.
        const createdPost = await this.postsRepository.createPost(
            userId,
            title,
            content
        )

        // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
        return {
            postId: createdPost.postId,
            userId: createdPost.userId,
            title: createdPost.title,
            content: createdPost.content,
            status: createdPost.status,
            createdAt: createdPost.createdAt,
        }
    }

    findAllPosts = async (orderKey, orderValue) => {
        // 저장소(Repository)에게 데이터를 요청합니다.
        const posts = await this.postsRepository.findAllPosts(
            orderKey,
            orderValue
        )

        // 호출한 Post들을 가장 최신 게시글 부터 정렬합니다.
        posts.sort((a, b) => {
            return b.createdAt - a.createdAt
        })

        // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
        return posts.map((post) => {
            return {
                postId: post.postId,
                userId: post.userId,
                userName: post.user.name,
                title: post.title,
                status: post.status,
                createdAt: post.createdAt,
            }
        })
    }

    findPostById = async (postId) => {
        // 저장소(Repository)에게 특정 게시글 하나를 요청합니다.
        const post = await this.postsRepository.findPostById(postId)

        return {
            postId: post.postId,
            userId: post.userId,
            title: post.title,
            content: post.content,
            status: post.status,
            createdAt: post.createdAt,
        }
    }

    updatePost = async (postId, password, title, content) => {
        // 저장소(Repository)에게 특정 게시글 하나를 요청합니다.
        const post = await this.postsRepository.findPostById(postId)

        if (!post) throw new Error('존재하지 않는 게시글입니다.')

        // 저장소(Repository)에게 데이터 수정을 요청합니다.
        await this.postsRepository.updatePost(postId, password, title, content)

        // 변경된 데이터를 조회합니다.
        const updatedPost = await this.postsRepository.findPostById(postId)

        return {
            postId: updatedPost.postId,
            userName: updatedPost.user.name,
            title: updatedPost.title,
            content: updatedPost.content,
            status: updatedPost.status,
            createdAt: updatedPost.createdAt,
            updatedAt: updatedPost.updatedAt,
        }
    }

    deletePost = async (postId, userId) => {
        // 저장소(Repository)에게 특정 게시글 하나를 요청합니다.
        const post = await this.postsRepository.findPostById(postId)
        if (!post) throw new Error('존재하지 않는 게시글입니다.')

        if (post.user.id !== userId) {
            throw new error('게시글을 삭제할 권한이 없습니다.')
        }
        // 저장소(Repository)에게 데이터 삭제를 요청합니다.
        await this.postsRepository.deletePost(postId)

        return {
            postId: post.postId,
            title: post.title,
            content: post.content,
            createdAt: post.createdAt,
        }
    }
}
