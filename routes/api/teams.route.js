import { Router } from 'express';
import authMiddleware from '../../middleware/auth.js'
import { getTeams, deleteTeam, updateTeam, createTeam } from '../../controllers/Team.controller.js'

const router = Router();

/**
 * @route   GET api/users
 * @desc    Get all users
 * @access  Private
 */

router.post('/list', authMiddleware, getTeams)
router.post('/delete', authMiddleware, deleteTeam)
router.post('/update', authMiddleware, updateTeam)
router.post('/create', authMiddleware, createTeam)

export default router