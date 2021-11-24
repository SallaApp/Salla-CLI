const { Sequelize, DataTypes } = require("sequelize");

const OauthTokens = require("./models/oauthtokens");
const PasswordResets = require("./models/passwordresets");
const User = require("./models/user");

// In a real app, you should keep the database connection URL as an environment variable.
// But for this example, we will just use a local SQLite database.
// const sequelize = new Sequelize(process.env.DB_CONNECTION_URL);
const sequelize = new Sequelize({
  host: process.env.DATABASE_SERVER,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: "my_app_db",
  dialect: "mysql",
  logging: true,
});

const modelDefiners = [
  OauthTokens,
  PasswordResets,
  User,
  // Add more models here...
  // require('./models/item'),
];

// We define all models according to their files.
for (let i = 0; i < modelDefiners.length; i++) {
  modelDefiners[i] = modelDefiners[i](sequelize, DataTypes);
  modelDefiners[i].associate(sequelize.models);
}

// We execute any associates  after the models are defined .

sequelize
  .sync()
  .then((data) => {})
  .catch((err) => {
    console.log("Error in creating and connecting database", err);
  });

// We export the sequelize connection instance to be used around our app.
module.exports = sequelize;
