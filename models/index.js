'use strict';

const { fstat } = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);


db.sequelize = sequelize;
db.Sequelize = Sequelize;


db.Jobs = require('./Jobs')(sequelize, Sequelize);
db.JobsData = require('./JobsData')(sequelize, Sequelize);
db.Markets = require('./Markets')(sequelize, Sequelize);
db.Memberships = require('./Memberships')(sequelize, Sequelize);
db.OpenMarkets = require('./OpenMarkets')(sequelize, Sequelize);
db.OpenMarketsData = require('./OpenMarketsData')(sequelize, Sequelize);
db.Plans = require('./Plans')(sequelize, Sequelize);
db.UploadWorks = require('./UploadWorks')(sequelize, Sequelize);
db.Users = require('./Users')(sequelize, Sequelize);


db.JobsData.hasMany(db.Jobs, {
    foreignKey:'data_id',
    sourceKey:'id'
});
db.Jobs.belongsTo(db.JobsData, {
    foreignKey: 'data_id',
    targetKey:'id'
});

db.Markets.hasMany(db.Jobs, {
    foreignKey:'market_id',
    sourceKey:'id'
});
db.Jobs.belongsTo(db.Markets, {
    foreignKey: 'market_id',
    targetKey:'id'
});

db.Users.hasMany(db.Jobs, {
    foreignKey:'user_id',
    sourceKey:'id'
});
db.Jobs.belongsTo(db.Users, {
    foreignKey: 'user_id',
    targetKey:'id'
});

db.OpenMarkets.hasMany(db.Markets, {
    foreignKey:'open_market_id',
    sourceKey:'id'
});
db.Markets.belongsTo(db.OpenMarkets, {
    foreignKey: 'open_market_id',
    targetKey:'id'
});

db.OpenMarketsData.hasMany(db.OpenMarkets, {
    foreignKey:'data_id',
    sourceKey:'id'
});
db.OpenMarkets.belongsTo(db.OpenMarketsData, {
    foreignKey: 'data_id',
    targetKey:'id'
});

db.Users.hasMany(db.OpenMarkets, {
    foreignKey:'user_id',
    sourceKey:'id'
});
db.OpenMarkets.belongsTo(db.Users, {
    foreignKey: 'user_id',
    targetKey:'id'
});

db.Users.hasMany(db.Memberships, {
    foreignKey:'user_id',
    sourceKey:'id'
});
db.Memberships.belongsTo(db.Users, {
    foreignKey: 'user_id',
    targetKey:'id'
});

db.Plans.hasMany(db.Memberships, {
    foreignKey:'plan_id',
    sourceKey:'id'
});
db.Memberships.belongsTo(db.Plans, {
    foreignKey: 'plan_id',
    targetKey:'id'
});

module.exports = db;
