const BaseClass = require("./theme/utils/BaseClass");

/**
 * Use For Internal Development
 * @property {DevOptions} options
 */
class Dev extends BaseClass {

    run() {
        if (!/^https?:\/\//.test(this.options.base)) {
            this.error('Wrong Url!');
            return;
        }
        this.authManager(true).set('BASE_URL', this.options.base);
    }

}

module.exports = Dev;
