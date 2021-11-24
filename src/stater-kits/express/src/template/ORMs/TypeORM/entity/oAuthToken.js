var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "oAuthToken", // Will use table name `oAuthToken` as default behaviour.
  tableName: "oauthtokens", // Optional: Provide `tableName` property to override the default behaviour for table name.
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    merchant: {
      type: "int",
    },
    access_token: {
      type: "varchar",
    },
    expires_in: {
      type: "int",
    },
    refresh_token: {
      type: "varchar",
    },
    relations: {
      type: "int",
      users: {
        target: "User",
        type: "one-to-one",
        joinTable: true,
        cascade: true,
      },
    },
  },
});
