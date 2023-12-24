import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Article = sequelize.define('Article', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    });

    return Article;
};
