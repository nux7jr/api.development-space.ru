import express from 'express';
import bodyParser from 'body-parser';
import { sequelize } from './models/index.js';

import authRoutes from './routes/auth.js';
import articlesRoutes from './routes/articles.js';
import userRoutes from './routes/user.js';
import publicRoutes from './routes/public.js'
import 'dotenv/config';
import cors from 'cors';

const app = express();
app.use(cors());
const PORT = process.env.PORT || 1337;

app.use(bodyParser.json());

sequelize.sync().then(() => {
    console.log('Database synced');
});

app.use('/auth', authRoutes);
app.use('/api', articlesRoutes);
app.use('/user', userRoutes);
app.use('/public', publicRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
