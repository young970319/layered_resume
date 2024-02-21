// userController.js

import userService from './userService'

class UserController {
    //회원가입
    signUp = async (req, res, next) => {
        try {
            const result = await userService.signUp(req.body)
            res.status(201).json(result)
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    }

    //로그인
    signIn = async (req, res, next) => {
        try {
            const result = await userService.signIn(req.body)
            res.cookie('authorization', `Bearer ${result.token}`)
            res.status(200).json(result)
        } catch (error) {
            res.status(401).json({ message: error.message })
        }
    }

    //내정보조회
    getUserInfo = async (req, res, next) => {
        try {
            const result = await userService.getUserInfo(req.user.userId)
            res.status(200).json({ data: result })
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }
}

const userController = new UserController()
export default userController
