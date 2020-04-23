class lowDbInterface {
    constructor(fileName) {
        const low = require('lowdb');
        const FileSync = require('lowdb/adapters/FileSync');
        const adapter = new FileSync('../main_menu/mainMenu.json');
        this.db = low(adapter);
    }

    async getArrayFromDb(arrayName) {
        return this.db.get(arrayName);
    }
}

module.exports = lowDbInterface;