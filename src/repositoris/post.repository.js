import { prisma } from '../routes/index.js'

export class PostsRepository {
    // 이력서 생성 o
    createPost = async (userId, title, content) => {
        // ORM인 Prisma에서 Posts 모델의 create 메서드를 사용해 데이터를 요청합니다.
        const createdPost = await prisma.posts.create({
            data: {
                userId: Number(userId),
                title,
                content,
            },
        })

        return createdPost
    }

    // 이력서 전체조회 o
    findAllPosts = async (orderKey, orderValue) => {
        // ORM인 Prisma에서 Posts 모델의 findMany 메서드를 사용해 데이터를 요청합니다.
        const posts = await prisma.posts.findMany({
            where: {
                userId: Number(orderKey),
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
                [orderKey]: orderValue.toLowerCase(), // 게시글을 최신순으로 정렬합니다./
            },
        })
        return posts
    }

    // 이력서 상세조회 o
    findPostById = async (postId) => {
        // ORM인 Prisma에서 Posts 모델의 findUnique 메서드를 사용해 데이터를 요청합니다.
        const post = await prisma.posts.findUnique({
            where: { postId: Number(postId) },
            select: {
                postId: true,
                userId: true,
                title: true,
                content: true,
                createdAt: true,
                updatedAt: true,
            },
        })

        return post
    }

    // 이력서 수정 o
    updatePost = async (postId, title, content, status) => {
        // ORM인 Prisma에서 Posts 모델의 update 메서드를 사용해 데이터를 수정합니다.
        const updatedPost = await prisma.posts.update({
            where: {
                postId: Number(postId),
            },
            data: {
                title,
                content,
                status,
            },
        })

        return updatedPost
    }

    // 이력서 삭제 o
    deletePost = async (postId) => {
        // ORM인 Prisma에서 Posts 모델의 delete 메서드를 사용해 데이터를 삭제합니다.
        const deletedPost = await prisma.posts.delete({
            where: {
                postId: Number(postId),
            },
        })

        return deletedPost
    }
}
