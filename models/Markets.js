module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Markets', {
        open_market_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        registration_number: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        access_key: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        secret_key: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        vendor_id: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        upload_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
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