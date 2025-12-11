#!/usr/bin/env node

// qiao
const cli = require('qiao-cli');

// cmds
require('./viho-model.js');
require('./viho-ask.js');
require('./viho-chat.js');
require('./viho-version.js');

// parse
cli.cmd.parse(process.argv);
