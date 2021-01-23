import { Router } from 'express'
import { autoCatch } from '../middlewares/auto-catch.middleware'
import postLogin from './post.login'

const router = Router()

router.post('/login', autoCatch(postLogin))

export default router
