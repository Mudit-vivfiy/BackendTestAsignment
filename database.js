const Sequelize = require("sequelize");
var Database = new function () {
  var sequelize = new Sequelize({
    host: "localhost",
    username: "root",
    password: "12345",
    database: "database1",
    dialect: "mysql",
    logging: false,
    port: 3306,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });

  sequelize
    .authenticate()
    .then(() => {
      console.log("Database Connected");
    })
    .catch((err) => {
      console.log("Not Conncted" + err);
    });
  this.User = sequelize.define(
    'users',
    {
      id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },
      firstname: {
        type: Sequelize.STRING,
      },
      lastname: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.STRING,
      },
    },
    {
      tableName: "users",
      createdAt: false,
      updatedAt: false,
    }
  );
  sequelize.sync({ alter: true }).then(() => {
    console.log("Sync Completed");
  });
  return this;
};
module.exports = Database;
