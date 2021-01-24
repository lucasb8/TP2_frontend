import { Router } from 'express'
import { autoCatch } from '../middlewares/auto-catch.middleware'
import { requireLogged } from '../middlewares/require-logged.middleware'
import postLogin from './post.login'
import deleteLogout from './delete.logout'

const router = Router()

router.post('/login', autoCatch(postLogin))
router.delete('/logout', requireLogged, autoCatch(deleteLogout))

export default router
