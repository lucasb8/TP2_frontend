import { Router } from 'express'
import { autoCatch } from '../middlewares/auto-catch.middleware'
import { requireLogged } from '../middlewares/require-logged.middleware'
import { encapsulateInTransaction } from '../middlewares/transaction.middleware'
import usersGetMe from './users/get.me'
import usersGetIndex from './users/get.index'
import usersPostRegister from './users/post.register'
import bookingsPostProposals from './bookings/post.proposals'
import bookingsPostCoverage from './bookings/post.coverage'

const router = Router()

// no authentification required
router.post('/users/register', autoCatch(encapsulateInTransaction(usersPostRegister)))
router.post('/bookings/coverage', autoCatch(bookingsPostCoverage))
router.post('/bookings/proposals', autoCatch(bookingsPostProposals))

// authentification required
router.use(requireLogged)
router.get('/users/me', autoCatch(usersGetMe))
router.get('/users', autoCatch(usersGetIndex))

export default router
