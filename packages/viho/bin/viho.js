#!/usr/bin/env node

// qiao
const cli = require('qiao-cli');

// cmds
require('./sshs-version.js');

// parse
cli.cmd.parse(process.argv);
