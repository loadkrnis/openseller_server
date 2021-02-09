module.exports = (sequelize, DataTypes) => {
    return sequelize.define('JobsData', {
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    });
  };