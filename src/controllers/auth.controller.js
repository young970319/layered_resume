const generateNewAccessTokenByFreshToken = async (req, res) => {
    const { refreshToken } = req.body

    const token = jwtwebToken.verify(refreshToken, 'resume&%*')
    if (!token.userId) {
        return res.status(401).end()
    }

    const user = await Prisma.user.findFirst({
        where: {
            userId: token.userId,
        },
    })

    if (!user) {
        return res.status(401).end()
    }

    const newAccessToken = jwtwebToken.sign(
        { userId: user.userId },
        'resume@#',
        { expiresIn: '12h' }
    )
    const newRefreshToken = jwtwebToken.sign(
        { userId: user.userId },
        'resume&%*',
        { expiresIn: '7d' }
    )

    return res.json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    })
}

export default router
