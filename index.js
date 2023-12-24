import express from 'express';
import bodyParser from 'body-parser';
import { sequelize } from './models/index.js';
import authRoutes from './routes/auth.js';
import articlesRoutes from './routes/articles.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

sequelize.sync().then(() => {
    console.log('Database synced');
});

app.use('/auth', authRoutes);
app.use('/api', articlesRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
