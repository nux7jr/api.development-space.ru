import express from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/index.js';
import verifyToken from '../middleware/auth.js'
import path from 'path';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    },
});

const upload = multer({ storage: storage });

router.post('/create', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            name,
            password: hashedPassword,
        });

        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.put('/edit', verifyToken, upload.single('image'), async (req, res) => {
    try {
        const { name, description } = req.body;
        const imagePath = req.file.path;
        const user = await User.findOne({ where: { id: req.userId } });

        user.name = name;
        user.description = description;
        user.image = imagePath;
        await user.save();

        res.status(201).json({ message: 'User edit successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// router.put('/edit', verifyToken, upload.single('image'), async (req, res) => {
//     try {
//         const { name, description } = req.body;
//         const imageBuffer = req.file.buffer;
//         const user = await User.findOne({ where: { id: req.userId } });

//         user.name = name;
//         user.description = description;
//         user.image = imageBuffer;
//         await user.save();

//         res.status(201).json({ message: 'User edit successfully', user });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findAll({
            where: { id: req.userId },
            attributes: ['id', 'email', 'name', 'description', 'image'],
        });
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/profile/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findAll({ where: { id: id } });
        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// router.get('/all', async (req, res) => {
//     const users = await User.findAll();
//     const usersWithImages = users.map(user => ({
//         id: user.id,
//         name: user.name,
//         image: user.image ? user.image.toString('base64') : null
//     }));
//     res.status(201).json({ message: 'User edit successfully', usersWithImages });
// })

export default router;
