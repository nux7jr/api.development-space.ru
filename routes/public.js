import express from 'express';
import { Article, User, sequelize } from '../models/index.js';
const router = express.Router();

router.get('/news', async (req, res) => {
    try {
        const news = await Article.findAll({
            attributes: ['title', 'link', 'content', 'createdAt'],
            include: [
                {
                    model: User,
                    attributes: ['image', 'name', 'description', 'id'],
                },
            ],
            order: [['createdAt', 'DESC']],
        });
        res.json(news);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/news/:link', async (req, res) => {
    try {
        const { link } = req.params;
        const article = await Article.findOne({
            where: { link: link },
            attributes: ['title', 'link', 'content', 'createdAt'],
            include: [
                {
                    model: User,
                    attributes: ['image', 'name', 'description', 'id'],
                },
            ],
        });
        res.json(article);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


export default router;
