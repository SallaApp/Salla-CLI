const BaseClass = require("./theme/utils/BaseClass");

/**
 * Use For Internal Development
 * @property {DevOptions} options
 */
class Dev extends BaseClass {

    run() {
        if (this.options.base && /^https?:\/\//.test(this.options.base)){
            this.authManager(true).set('BASE_URL', this.options.base);
            return;
        }

        if(this.options.config){
            this.getTokens(true).then(sallaConfig=>console.log(sallaConfig))
            return;
        }
    }

}

module.exports = Dev;
