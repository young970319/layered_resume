import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userRepository from './repository'

export class UserService {
    signUp = async (userData) => {
        const { email, password, passwordCheck, name } = userData

        const isExistUser = await userRepository.findByEmail(email)

        if (isExistUser) {
            throw new Error('이미 존재하는 이메일입니다.')
        }

        if (password !== passwordCheck) {
            throw new Error('비밀번호 확인이 일치하지 않습니다.')
        }

        if (password.length < 6) {
            throw new Error(
                '비밀번호 길이가 짧습니다. 6자 이상으로 입력해주세요.'
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await userRepository.createUser({
            email,
            password: hashedPassword,
            name,
        })

        return { message: '회원가입이 완료되었습니다.' }
    }

    signIn = async (userData) => {
        const { email, password } = userData

        const user = await userRepository.findByEmail(email)

        if (!user) {
            throw new Error('존재하지 않는 이메일입니다.')
        }

        if (!(await bcrypt.compare(password, user.password))) {
            throw new Error('비밀번호가 일치하지 않습니다.')
        }

        const token = jwt.sign(
            {
                userId: user.userId,
            },
            process.env.JWT_key,
            { expiresIn: '12h' }
        )

        return { message: '로그인 성공', token }
    }

    getUserInfo = async (userId) => {
        return await userRepository.findUserById(userId)
    }
}

const userService = new UserService()
export default userService
