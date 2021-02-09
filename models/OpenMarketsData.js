module.exports = (sequelize, DataTypes) => {
    return sequelize.define('OpenMarketsData', {
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    },{
        timestamps: false
    });
  };