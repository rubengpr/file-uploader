import { Router } from 'express'
import authenticateToken from '../middleware/authMiddleware.js'
import * as profileController from '../controllers/profileController.js'

const router = Router()

router.use(authenticateToken)

router.get('/me', profileController.getUser)
router.patch('/update', profileController.updateUser)

router.use('*', (req, res) => {
    res.status(405).json({ 
      message: 'Method not allowed',
      allowedMethods: ['GET', 'PATCH']
    })
})

export default router