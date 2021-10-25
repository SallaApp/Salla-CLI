const BaseClass = require('./utils/BaseClass');

class Publish extends BaseClass {
    async run(options) {
        if (!this.isReadyForPublish()) {
            this.error('Failed to publish theme.');
            return null;
        }
    }

    isReadyForPublish() {
        return this.config();
    }
}

module.exports = Publish;