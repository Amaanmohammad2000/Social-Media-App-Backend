/* eslint-disable no-fallthrough */
const Sequelize = require("sequelize");

const dbOptions = env.DB_OPTIONS;

const models = require("./models");

let database = {};

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
  ...dbOptions,
});

database = models(sequelize);   

database.Sequelize = Sequelize;

database.authenticate = () => sequelize.authenticate();

module.exports = database;
