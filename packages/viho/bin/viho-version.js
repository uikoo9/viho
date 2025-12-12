// qiao
const cli = require('qiao-cli');

// cmd
cli.cmd
  .version(require('../package.json').version, '-v, --version')
  .description('A lightweight CLI tool for managing and interacting with AI models')
  .usage('<command>');
