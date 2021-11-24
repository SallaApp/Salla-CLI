"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const { User, OauthTokens } = models;
      OauthTokens.belongsTo(User);
      User.hasMany(OauthTokens);
    }
  }

  User.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      email_verified_at: DataTypes.INTEGER,
      verified_at: DataTypes.INTEGER,
      password: DataTypes.STRING,
      remember_token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
