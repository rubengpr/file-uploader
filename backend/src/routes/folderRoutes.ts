import { Router } from 'express';
import sanitize from 'sanitize-filename'
import authenticateToken from '../middleware/authMiddleware.js'
import DOMPurify from "isomorphic-dompurify"
import prisma from '../lib/prisma.js'
import * as folderController from '../controllers/folderController.js'

const router = Router()

router.use(authenticateToken)

router.get('/get/:folderId', folderController.getFolders)
router.get('/hierarchy/:folderId', folderController.getFolderHierarchy)
router.post('/create', folderController.createFolder)
router.patch('/rename', folderController.renameFolder)
router.delete('/delete', folderController.deleteFolder)

router.use('*', (req, res) => {
    res.status(405).json({ 
      message: 'Method not allowed',
      allowedMethods: ['GET', 'POST', 'PATCH', 'DELETE']
    })
})

export default router