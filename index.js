import express from 'express';
import bodyParser from 'body-parser';
import { sequelize } from './models/index.js';

import articlesRoutes from './routes/articles.js';
import userRoutes from './routes/user.js';
import 'dotenv/config';
import cors from 'cors';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors({
    origin: process.env.BASE_URL,
    credentials: true,
}));

app.use('/uploads', express.static(join(__dirname, 'uploads')));


const PORT = process.env.PORT || 7000;

app.use(bodyParser.json());

sequelize.sync().then(() => {
    console.log('Database synced');
});


app.use('/user', userRoutes);
app.use('/article', articlesRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
