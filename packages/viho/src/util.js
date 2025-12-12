// os
const os = require('os');

// path
const path = require('path');

// qiao
const cli = require('qiao-cli');

// db
const DB = require('qiao-config');

/**
 * getDB
 * @returns
 */
exports.getDB = () => {
  const dbPath = path.resolve(os.homedir(), './viho.json');
  return DB(dbPath);
};

/**
 * printLogo
 */
exports.printLogo = () => {
  console.log(
    cli.colors.green(`
██╗   ██╗██╗██╗  ██╗ ██████╗
██║   ██║██║██║  ██║██╔═══██╗
██║   ██║██║███████║██║   ██║
╚██╗ ██╔╝██║██╔══██║██║   ██║
 ╚████╔╝ ██║██║  ██║╚██████╔╝
  ╚═══╝  ╚═╝╚═╝  ╚═╝ ╚═════╝
    `),
  );
};
