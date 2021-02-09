module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Jobs', {
        data_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        market_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        work_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('now()'),
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
    }, {
        timestamps: false,
    });
  };