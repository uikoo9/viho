// path
const path = require('path');

// qiao
const { download } = require('qiao-downloader');

// experts
const { experts } = require('../viho/src/experts/experts.js');

// go
(async () => {
  // download
  const destPath = path.resolve(__dirname, '../viho/src/experts');
  for (let i = 0; i < experts.length; i++) {
    const name = experts[i].name;
    const url = experts[i].url;
    const dest = path.resolve(destPath, `./${name}.md`);
    try {
      console.log(`start downloading ${name} from ${url} to ${dest} ...`);
      await download(url, dest, { checkFileSize: false });
    } catch (error) {
      console.log('error');
      console.log(error);
      return;
    }
  }
})();
