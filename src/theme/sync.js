const BaseClass = require('./utils/BaseClass');

/**
 * @property {SyncOptions} options
 */
class Sync extends BaseClass {

    /**
     * @return {Promise<{}|boolean>}
     */
    async run() {
        if (!this.options.theme_id) {
            this.error('theme_id'.bold + ' not passed!');
            return null;
        }
        if (!this.options.file) {
            this.error('File not received!');
            return null;
        }
        if (!await this.fileSys().exists(this.options.file)) {
            this.error('File not exists!');
            return null;

        }
        let path = this.options.file
            .replace(process.cwd(), '')//remove full path before current working path
            .replace(/^\/|\/+$/g, '') //remove forward slashes from the beginning & the end of the path;
            .replace(/\\/g,'/'); // replace windows path

        if (this.fileSys().statSync(this.options.file).size > 1024 * 500) {
            this.error(`File (${path.bold}) is larger than 500 KB.`);
            return null;
        }
        let fileName = this.path().basename(this.options.file);
        let file = await this.fileSys().createReadStream(this.options.file);
        
        const fromData = new (require('form-data'))();
        fromData.append("file", file, fileName);
        //TODO:: make sure that path is same in windows|mac|linux (back slash, forward slash)
        
        fromData.append("path", path.replace(fileName, ''));
        fromData.params = [this.options.theme_id]
        await (await this.sallaApi(/*skip_tokens_check*/true)).request('upload_file', fromData, fromData.getHeaders())
            .then(res => {
                if (res === false) {
                    this.error('Failed to sync: ' + path.bold);
                }
                if (res.status === 200) {
                    this.success(`File (${path.bold}) synced.`)
                }
            });
        this.readyToReturn = true;

        await this.checkIsReadyToReturn();
        return file;
    }
}

module.exports = Sync;
