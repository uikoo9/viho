// os
const os = require('os');

// path
const path = require('path');

// qiao
const cli = require('qiao-cli');

// db
const DB = require('qiao-config');

// model
const { getModelByName } = require('./model.js');

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

/**
 * preLLMAsk
 * @param {*} type
 * @param {*} db
 * @param {*} modelName
 * @returns
 */
exports.preLLMAsk = async (type, db, modelName) => {
  // model
  const model = await getModelByName(db, modelName);
  if (!model) return;

  // logo
  exports.printLogo();
  console.log(cli.colors.cyan(`Welcome to viho ${type}! Using model: ${model.modelName}`));
  console.log(cli.colors.gray('Press Ctrl+C to exit\n'));

  // r
  return model;
};
