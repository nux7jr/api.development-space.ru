import express from 'express';
import jwt from 'jsonwebtoken';
import { Article, sequelize } from '../models/index.js';

const router = express.Router();

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, 'your-secret-key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }

        req.userId = decoded.userId;
        next();
    });
};

router.get('/articles', verifyToken, async (req, res) => {
    const articles = await Article.findAll({ where: { UserId: req.userId } });
    res.json(articles);
});

router.post('/articles', verifyToken, async (req, res) => {
    const { title, content } = req.body;

    const article = await Article.create({ title, content, UserId: req.userId });
    res.status(201).json(article);
});

router.put('/articles/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    const article = await Article.findOne({ where: { id, UserId: req.userId } });

    if (!article) {
        return res.status(404).json({ message: 'Article not found' });
    }

    article.title = title;
    article.content = content;
    await article.save();

    res.json(article);
});

router.delete('/articles/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    const article = await Article.findOne({ where: { id, UserId: req.userId } });

    if (!article) {
        return res.status(404).json({ message: 'Article not found' });
    }

    await article.destroy();

    res.json({ message: 'Article deleted successfully' });
});

export default router;
