module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Plans', {
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        fee: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        limit_use: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });
  };