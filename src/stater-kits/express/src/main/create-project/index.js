class Executor {
  setPrameters({
    src,
    app_name,
    app_client_id,
    app_client_secret,
    auth_mode,
    webhook_secret,
    database_orm,
    progressBar,
  }) {
    this.src = src;
    this.app_name = app_name;
    this.app_path = `${process.cwd()}/${app_name}`;
    this.app_client_id = app_client_id;
    this.app_client_secret = app_client_secret;
    this.auth_mode = auth_mode;
    this.webhook_secret = webhook_secret;
    this.database_orm = database_orm;
    this.progressBar = progressBar;
  }

  execute() {
    return new Promise(async (resolve, reject) => {
      const ExcutingSteps = [
        //
        new (require("../../commands/check-deps"))(),
        new (require("../../commands/copy-template"))(),
        new (require("../../commands/creating-env-file"))(),
        new (require("../../commands/setup-packages"))(),
        new (require("../../commands/setup-ORM"))(),
        new (require("../../commands/project-mode"))(),
      ];
      const messages = [];

      this.progressBar.start(ExcutingSteps.length, 0);
      try {
        for (let i = 0; i < ExcutingSteps.length; i++) {
          messages.push(
            await ExcutingSteps[i].start({
              app_path: this.app_path,
              src: this.src,
              app_name: this.app_name,
              app_client_id: this.app_client_id,
              app_client_secret: this.app_client_secret,
              auth_mode: this.auth_mode,
              webhook_secret: this.webhook_secret,
              database_orm: this.database_orm,
              progressBar: this.progressBar,
            })
          );
          this.progressBar.update(i + 1, {
            process: ExcutingSteps[i]._message,
          });
        }
        resolve(messages);
      } catch (err) {
        reject([messages, ...err]);
      }
      this.progressBar.stop();
    });
  }
}
module.exports = new Executor();
