import { Sequelize } from 'sequelize';
import UserModel from './user.js';
import ArticleModel from './article.js';
import 'dotenv/config';

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const User = UserModel(sequelize);
const Article = ArticleModel(sequelize);

User.hasMany(Article);
Article.belongsTo(User);

export { User, Article, sequelize };
