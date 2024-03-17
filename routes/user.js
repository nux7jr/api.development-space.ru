import express from 'express';
import UserController from '../controllers/UserController.js';
import verifyToken from '../middleware/verifyToken.js'
import multer from 'multer';
const router = express.Router();
const upload = multer({ storage: UserController.storage });

router.put('/edit', verifyToken, upload.single('image'), UserController.edit);
router.get('/profile', verifyToken, UserController.profile);
router.get('/profile/:id', UserController.profileId); // тут отдавать все статьи пользователя
router.post('/login', UserController.login);
router.post('/refresh-token', UserController.refreshToken);
router.post('/create', UserController.create);

export default router;
