#!/usr/bin/env node

// qiao
const cli = require('qiao-cli');

// util
const { printLogo } = require('../src/util.js');

// cmds
require('./viho-model.js');
require('./viho-ask.js');
require('./viho-chat.js');
require('./viho-expert.js');
require('./viho-version.js');

// print logo if no args or help
if (process.argv.length === 2 || process.argv.includes('-h') || process.argv.includes('--help')) {
  printLogo();
}

// parse
cli.cmd.parse(process.argv);
