"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OauthTokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  OauthTokens.init(
    {
      user_id: DataTypes.INTEGER,
      merchant: DataTypes.INTEGER,
      access_token: DataTypes.STRING,
      expires_in: DataTypes.INTEGER,
      refresh_token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "OauthTokens",
    }
  );
  return OauthTokens;
};
