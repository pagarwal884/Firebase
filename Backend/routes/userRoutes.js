import express from 'express'
import { LoginUser,RegisterUser, AdminLogin } from '../controllers/userController.js'

const userRouter = express.Router();

userRouter.post('/register',RegisterUser)
userRouter.post('/login',LoginUser)
userRouter.post('/admin',AdminLogin)

export default userRouter
