const BaseClass = require("./utils/BaseClass");
const { exec, execSync } = require("child_process");
const Logger = require("../utils/LoggingManager");

const { AuthManager, GithubAPI } = require("../utils/AuthManager")();

/**
 * @property {PublishOptions} options
 */
class Publish extends BaseClass {
  async run() {
    if (!(await this.isReadyForPublish())) {
      Logger.error("Failed to publish theme.");
      return null;
    }
    Logger.info("  Publishing your theme to Salla...");

    /**
     * @type {SallaConfig}
     */
    let tokens = await this.getTokens();
    GithubAPI.setConfigData(tokens.github);
    let command = `push --force --token ${tokens.github.access_token} --name ${tokens.github.login}`;

    this.runTheme(command + ' --minor --message "New Release 🚀"');
    await (await this.sallaApi(/*skip_tokens_check*/ true))
      .request("publish", { params: [this.configs().draft_id] })
      .then(async (res) => {
        if (res === false) {
          Logger.error("Failed to publish theme.");
        }
        if (res.status === 200) {
          await this.configManager().set("theme_id", res.data.theme_id);
          this.runTheme(command + ' --message "Pump Version ⬆️"');

          Logger.success(`Theme published successfully`);
        }
      });
  }

  async isReadyForPublish() {
    const config = this.configs();

    //check the draft id
    if (!config.draft_id) {
      Logger.info(`please run ${"salla theme watch"} to create draft theme`);

      return null;
    }

    // check author name
    if (!config.author) {
      const author = InputsManager.readLine("What is the author name ?", {
        name: "author name",
        validate: /^[a-zA-Z0-9\s_-]+$/,
      });
      this.configManager().set("author", author || defaultAnswers.author);
    }

    // check email
    if (!config.email) {
      const email = InputsManager.readLine("What is your email ?", {
        name: "email",
        validate: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      });
      this.configManager().set("email", email || defaultAnswers.email);
    }

    // check the support url
    if (!config.support_url) {
      const support_url = InputsManager.readLine("What is your support url ?", {
        name: "support url",
        validate: /^https?:\/\//,
      });
      this.configManager().set("support_url", support_url);
    }

    return this.configs();
  }
}

const defaultAnswers = {
  author: GithubAPI.getGitName(),
  email: GithubAPI.getGitEmail(),
};

module.exports = Publish;
