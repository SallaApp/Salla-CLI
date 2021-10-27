const BaseClass = require("./utils/BaseClass");

/**
 * @property {PublishOptions} options
 */
class Publish extends BaseClass {
  async run() {
    if (!(await this.isReadyForPublish())) {
      this.error("Failed to publish theme.");
      return null;
    }

    this.log("  Publishing your theme to Salla...".green);
     /**
         * @type {SallaConfig}
         */
    let tokens = await this.getTokens();
    let command = `push --force --token ${tokens.github.access_token} --name ${tokens.github.login}`;


  

   this.runTheme(command + ' --minor --message "New Release 🚀"');
    await (await this.sallaApi(/*skip_tokens_check*/true)).request('publish', {params:[this.configs().draft_id]})
    .then(async(res) => {
        if (res === false) {
            this.error('Failed to publish');
        }
        if (res.status === 200) {
          await this.configManager().set("theme_id", res.data.theme_id);
           this.runTheme(command + ' --message "Pump Version ⬆️"')
           this.success(`Theme published successfully`)
        }
    });

  }

  async isReadyForPublish() {
    const config = this.configs();

    //check the draft id
    if (!config.draft_id) {
      this.log(`please run ${"salla theme watch".green} to create draft theme`);
      return null;
    }



    // check author name
    if (!config.author) {
        //this.error("There is no author");
        let prompts = [];
        if (!config.email) {
          prompts.push({
            type: "input",
            name   : "author",
            message: "What is the author name ?",
            validate: (val) => /^[a-zA-Z0-9\s_-]+$/.test(val) || "You must enter a Valid name",
            //default: defaultAnswers.author,
          });
        }
        const answers = await this.inquirer().prompt(prompts);
        this.configManager().set("author", answers.author);
      }



    // check email
    if (!config.email) {
     // this.error("There is no email");
      let prompts = [];
      if (!config.email) {
        prompts.push({
          type: "input",
          name: "email",
          message: "What is your email ?",
          validate: (val) =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || "You must enter an email",
          //default: defaultAnswers.email,
        });
      }
      const answers = await this.inquirer().prompt(prompts);
      this.configManager().set("email", answers.email);
    }

    // check the support url
    if (!config.support_url) {
     // this.error("There is no support url");
      let prompts = [];
      if (!config.support_url) {
        prompts.push({
          type: "input",
          name: "support_url",
          message: "What is your support url ?",
          validate: (val) =>
            /^https?:\/\//.test(val) || "You must enter a valid URL",
          //default: defaultAnswers.support_url,
        });
      }
      const answers = await this.inquirer().prompt(prompts);
      this.configManager().set("support_url", answers.support_url);
    }
    return this.configs();
  }
}

module.exports = Publish;
