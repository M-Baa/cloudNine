import express from 'express'
import { test, updateUser, deleteUser, getAllUsers } from '../controller/user.controller.js'
import { verifyToken } from '../utils/verifyUser.js'


const router = express.Router()

router.get('/', test)
router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)


router.get('/all', getAllUsers); // New route to fetch all users

export default router