import { Router } from 'express'
import authenticateToken from '../middleware/authMiddleware.js'
import * as fileController from '../controllers/fileController.js'

const router = Router()

router.use(authenticateToken)

router.post('/create', fileController.createFile)
router.get('/get/:folderId', fileController.getFiles)
router.patch('/rename', fileController.renameFile)
router.delete('/delete', fileController.deleteFile)

router.use('*', (req, res) => {
    res.status(405).json({ 
      message: 'Method not allowed',
      allowedMethods: ['GET', 'POST', 'PATCH', 'DELETE']
    })
})

export default router