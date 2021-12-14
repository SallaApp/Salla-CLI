const ExecutionManager = require("../../../../../utils/ExecutionManager");
const fs = require("fs");
module.exports = function (args) {
  const executor = new ExecutionManager();
  return executor.run([
    {
      cmd: "check",
      name: "node",
      version: NODE_ENGINES,
      msg: "🔍 Looking up for NodeJS's version ...",
    },
    {
      cmd: "check",
      name: "npm",
      version: NPM_ENGINES,
      msg: "🔍 Looking up for NPM's version ...",
    },
    {
      cmd: "makedir",
      path: args.app_path,
      msg: "📁 Creating the Project's Folder ...",
    },

    {
      cmd: "copyMulti",
      files: [".gitignore", "views", "helpers", "Actions"],
      src: `${args.src}`,
      dest: `${args.app_path}`,
      msg: "📄 Copying the Main Files and Folders to the newly created Project ...",
    },
    {
      cmd: "create",

      path: `${args.app_path}/.env`,
      content: generateEnv(args),
      msg: "📋 Creating the .env file ...",
    },
    {
      cmd: "copy",
      src: `${args.src}/ORMs/${args.database_orm}`,
      dest: `${args.app_path}/database/${args.database_orm}`,
      msg: "⚙️ Setting up the Preferred Database ORM Files ...",
    },
    {
      cmd: "copy",
      src: `${args.src}/app.${args.database_orm}.js`,
      dest: `${args.app_path}/app.js`,
      msg: "⚙️ Setting up the Preferred Database ORM app.js file ...",
    },
    {
      cmd: "exec",
      command: "npm init -y",
      path: `${args.app_path}`,
      msg: "🗄️ Initializing the Project's NPM file ...",
    },
    // FOR TESTING ONLY
    {
      cmd: "exec",
      command: "npm link @salla.sa/webhooks-actions",
      path: `${args.app_path}`,
      msg: "🔗 Linking webhooks-actions package ...",
    },
    {
      cmd: "create",
      content: () => {
        return getPakcagejson(args);
      },
      path: `${args.app_path}/package.json`,
      msg: "🔥 Installing all package.json dependencies ...",
    },
    {
      cmd: "exec",
      command: "npm install",
      path: `${args.app_path}`,
      msg: "✨ Installing Project dependencies with NPM ...",
    },
  ]);
};

function generateEnv(args) {
  let outputEnv = "";
  const envOjb = {
    SALLA_OAUTH_CLIENT_ID: args.app_client_id,
    SALLA_OAUTH_CLIENT_SECRET: args.app_client_secret,
    SALLA_WEBHOOK_SECRET: args.webhook_secret,
    SALLA_AUTHORIZATION_MODE: args.auth_mode,
    SALLA_OAUTH_CLIENT_REDIRECT_URI: "",
    SALLA_APP_ID: args.app_id,

    DATABASE_PASSWORD: "",
    DATABASE_USERNAME: "",
    DATABASE_SERVER: "",
  };
  for (let e in envOjb) {
    outputEnv += `${e}=${envOjb[e]}\n`;
  }
  return outputEnv;
}

function getPakcagejson(args) {
  const packageJSON = JSON.parse(
    fs.readFileSync(`${args.app_path}/package.json`)
  );
  let packages = [
    ["@salla.sa/passport-strategy", "^1.0.2"],
    ["@salla.sa/webhooks-actions", "^1.0.0"],
    ["body-parser", "^1.19.0"],
    ["consolidate", "^0.15.0"],
    ["dotenv", "^8.2.0"],
    ["express", "^4.17.1"],
    ["express-session", "^1.15.6"],
    ["nunjucks", "^3.2.1"],
    ["passport", "^0.1.0"],
  ];
  if (args.database_orm == "Sequelize") {
    packages.push(["sequelize", "^6.12.0-alpha.1"]);
    packages.push(["mysql2", "^2.3.3"]);
  }
  if (args.database_orm == "Mongoose") {
    packages.push(["mongoose", "6.0.13"]);
    packages.push(["validator", "^10.0.0"]);
  }
  if (args.database_orm == "TypeORM") {
    packages.push(["typeorm", "0.2.41"]);
    packages.push(["mysql2", "^2.3.3"]);
  }

  packageJSON.scripts = {
    "start-app": "node app.js",
  };
  packageJSON.description =
    "📦 New Awesome Application using Salla API and NodeJS";
  packageJSON.dependencies = packages.reduce(
    (a, v) => ({
      ...a,
      [v[0]]: v[1],
    }),
    {}
  );
  return JSON.stringify(packageJSON, null, 2);
}
