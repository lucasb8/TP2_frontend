import { Router } from 'express'
import { autoCatch } from '../middlewares/auto-catch.middleware'
import { requireLogged } from '../middlewares/require-logged.middleware'
import usersGetMe from './users/get.me'

const router = Router()

router.use(requireLogged)
router.get('/users/me', autoCatch(usersGetMe))

export default router
