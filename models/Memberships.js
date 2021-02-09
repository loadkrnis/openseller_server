module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Memberships', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        plan_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: false,
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