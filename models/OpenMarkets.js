module.exports = (sequelize, DataTypes) => {
    return sequelize.define('OpenMarkets', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        data_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('now()'),
        },
    }, {
        timestamps: false,
    });
  };