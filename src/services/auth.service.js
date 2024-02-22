import jwtwebToken from 'jsonwebtoken';
import {findOneUserByUserId} from ('../repositoris/user.repository.js')

const verifyFreshToken = async (refreshToken) => {
    const token = jwtwebToken.verify(refreshToken, 'resume&%*');

    if(!token.userId) {
        throw {
            code: 401,
            message: '토큰 정보가 올바르지 않습니다.'
        }
    }

    const user = await findOneUserByUserId(token.userId);

    if(!user){
        throw{
            code:401,
            message: '토큰 정보가 올바르지 않습니다.'
        }
    }

    const newAccessToken = jwtwebToken.sign({userId: user.userId}, 'resume@#', {expiresIn: '12h'})
    const newRefreshToken = jwtwebToken.sign({userId: user.userId}, 'resume&%*', {expiresIn: '7d'})

    return ({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    })
}