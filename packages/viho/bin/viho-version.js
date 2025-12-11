// qiao
const cli = require('qiao-cli');

// cmd
cli.cmd.version(require('../package.json').version, '-v, --version').description('viho').usage('<command>');
