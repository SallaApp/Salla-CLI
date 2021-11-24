var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "User", // Will use table name `User` as default behaviour.
  tableName: "users", // Optional: Provide `tableName` property to override the default behaviour for table name.
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    username: {
      type: "varchar",
    },
    email: {
      type: "varchar",
    },
    email_verified_at: {
      type: "int",
    },
    verified_at: {
      type: "int",
    },
    password: {
      type: "varchar",
    },
    remember_token: {
      type: "varchar",
    },
  },
});
