import { Router } from 'express'
import { autoCatch } from '../middlewares/auto-catch.middleware'
import { requireLogged } from '../middlewares/require-logged.middleware'
import usersGetMe from './users/get.me'
import usersGetIndex from './users/get.index'

const router = Router()

router.use(requireLogged)
router.get('/users/me', autoCatch(usersGetMe))
router.get('/users', autoCatch(usersGetIndex))

export default router
