module.exports = (sequelize, DataTypes) => {
    return sequelize.define('UploadWorks', {
        subject: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        detail: {
            type: DataTypes.TEXT,
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