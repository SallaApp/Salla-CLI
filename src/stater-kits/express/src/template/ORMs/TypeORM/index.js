var typeorm = require("typeorm");

module.exports = typeorm.createConnection({
  type: "mysql",
  host: "localhost",
  //port: 5432,
  username: process.env.DATABASE_USERNAME || "test",
  password: process.env.DATABASE_PASSWORD || "YOUR-PASSWORD",
  database: "my_app_db",
  synchronize: true,
  entities: [require("./entity/oAuthToken"), require("./entity/User")],
});
