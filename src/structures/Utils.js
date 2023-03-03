const {glob} = require('glob');
const {promisify} = require('util');
const proGlob = promisify(glob);

module.exports = class BotUtils {
  constructor(Client) {
    this.client = Client;
  }

  async loadFiles(dirName){
    const files = await proGlob(`${process.cwd().replace(/\\/g, "/")}/${dirName}/**/*.js`);
    files.forEach((file) => delete require.cache[require.resolve(file)]);
    return files;
  }

  
};


