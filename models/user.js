import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const User = sequelize.define('User', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: false,
        },
        image: {
            type: DataTypes.BLOB('long'),
            allowNull: true,
            unique: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    return User;
};
