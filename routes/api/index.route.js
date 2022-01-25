import authRoutes from './auth.route.js';
import itemRoutes from './items.route.js';
import userRoutes from './users.route.js';
import teamRoutes from './teams.route.js';
import { Router } from 'express'

const router = Router()

router.use('/items', itemRoutes)
router.use('/users', userRoutes)
router.use('/teams', teamRoutes)
router.use('/auth', authRoutes)

export default router