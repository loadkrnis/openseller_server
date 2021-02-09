module.exports = (sequelize, DataTypes) => {
  return sequelize.define('apis', {
      market_type: {
          type: DataTypes.STRING(255),
          allowNull: false,
      },
      market_name: {
          type: DataTypes.STRING(255),
          allowNull: false,
      },
      vendorid: {
          type: DataTypes.STRING(20),
          allowNull: false,
          unique: true,
      },
      access_key: {
          type: DataTypes.STRING(255),
          allowNull: false,
      },
      secret_key: {
          type: DataTypes.STRING(255),
          allowNull: false,
      },
      create_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: sequelize.literal('now()'),
      },
  }, {
      timestamps: false,
  });
};