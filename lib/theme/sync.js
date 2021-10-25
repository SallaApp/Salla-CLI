const BaseClass = require('./utils/BaseClass');

class Sync extends BaseClass {

    /**
     * @param {{file:string|undefined, theme_id:number|undefined}} options
     * @return {Promise<{}|boolean>}
     */
    async run(options) {
        if (!options.theme_id) {
            this.error('theme_id'.bold + ' not passed!');
            return null;
        }
        if (!options.file) {
            this.error('File not received!');
            return null;
        }
        if (!await this.fileSys().exists(options.file)) {
            this.error('File not exists!');
            return null;

        }
        let fileName = this.path().basename(options.file);
        let file = await this.fileSys().createReadStream(options.file);
        const fromData = new (require('form-data'))();
        fromData.append("file", file, fileName);
        //TODO:: make sure that path is same in windows|mac|linux (back slash, forward slash)
        let path = options.file
            .replace(process.cwd(), '')//remove full path before current working path
            .replace(/^\/|\/+$/g, '');//remove forward slashes from the beginning & the end of the path;
        fromData.append("path", path.replace(fileName, ''));
        fromData.params = [options.theme_id]
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
