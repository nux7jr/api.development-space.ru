import express from 'express';
import jwt from 'jsonwebtoken';
import { Article, sequelize } from '../models/index.js';
import { transliterate } from 'transliteration';
import verifyToken from '../middleware/verifyToken.js'
import ArticleController from '../controllers/ArticleController.js';

import 'dotenv/config';
const router = express.Router();


router.get('/', ArticleController.index);
router.get('/:slug', ArticleController.getBySlug);

router.post('/', verifyToken, ArticleController.create);
router.put('/:id', verifyToken, ArticleController.edit);
router.delete('/:id', verifyToken, ArticleController.edit)

// router.get('/articles', verifyToken, async (req, res) => {
//     const articles = await Article.findAll({ where: { UserId: req.userId } });
//     res.json(articles);
// });

export default router;
