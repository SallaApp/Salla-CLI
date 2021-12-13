const BaseClass = require("./utils/BaseClass");
const Logger = require("../utils/LoggingManager");
/**
 * @property {SyncOptions} options
 */
class Sync extends BaseClass {
  /**
   * @return {Promise<{}|boolean>}
   */
  async run() {
    if (!this.options.theme_id) {
      Logger.error(
        "🤔 Hmmm! You need to specify a valid Theme ID, as theme_id didn't pass! Please try again."
      );

      return null;
    }
    if (!this.options.file) {
      Logger.error(
        "🛑 Oops! Unfortunately, the file was not received. Please try again."
      );
      return null;
    }
    if (!(await this.fileSys().exists(this.options.file))) {
      Logger.error(
        "🛑 Oops! Unfortunately, the file you specified doesn't exist. Please try again."
      );
      return null;
    }
    let path = this.options.file
      .replace(process.cwd(), "") //remove full path before current working path
      .replace(/^\/|\/+$/g, "") //remove forward slashes from the beginning & the end of the path;
      .replace(/\\/g, "/"); // replace windows path

    if (this.fileSys().statSync(this.options.file).size > 1024 * 500) {
      Logger.error(
        `🛑 Oops! The file (${path.bold}) is larger than 500 KB. Please try again with a smaller size.`
      );
      return null;
    }
    let fileName = this.path().basename(this.options.file);
    let file = await this.fileSys().createReadStream(this.options.file);

    const fromData = new (require("form-data"))();
    fromData.append("file", file, fileName);
    //TODO:: make sure that path is same in windows|mac|linux (back slash, forward slash)

    fromData.append("path", path.replace(fileName, ""));
    fromData.params = [this.options.theme_id];

    await (await this.ThemeAPI(/*skip_tokens_check*/ true))
      .upload_file(fromData)
      .then((res) => {
        if (res === false) {
          Logger.error(
            "🤔 Hmmm! The system failed to sync: " +
              path.bold +
              " to the theme: " +
              this.options.theme_id.bold +
              "Please try again."
          );
        }
        if (res.status === 200) {
          Logger.success(
            `🎉 Hooray! The file (${path.bold}) is synced successfully to the theme: ${this.options.theme_id.bold}`
          );
        }
      });
    this.readyToReturn = true;

    await this.checkIsReadyToReturn();
    return file;
  }
}

module.exports = Sync;
