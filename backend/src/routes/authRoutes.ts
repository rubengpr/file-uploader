import { Router } from 'express'
import * as authController from '../controllers/authController.js'

const router = Router()

router.post('/login', authController.login)
router.post('/signup', authController.signup)
router.post('/recover-password', authController.recoverPassword)
router.post('/change-password', authController.changePassword)
router.post('/refresh', authController.refreshToken)

router.use('*', (req, res) => {
    res.status(405).json({ 
      message: 'Method not allowed',
      allowedMethods: ['POST']
    })
})

export default router