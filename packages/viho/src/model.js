// qiao
const cli = require('qiao-cli');

// models
const modelsKey = 'models';

/**
 * getModels
 * @param {*} db
 * @returns
 */
exports.getModels = async (db) => {
  return (await db.config(modelsKey)) || [];
};

/**
 * setModels
 * @param {*} db
 * @returns
 */
exports.setModels = async (db, models) => {
  await db.config(modelsKey, models);
};

/**
 * getModelByName
 * @param {*} db
 * @returns
 */
exports.getModelByName = async (db, modelName) => {
  if (!modelName) {
    const defaultModel = await db.config('default');
    if (!defaultModel) {
      console.log(cli.colors.red('No default model set. Use: viho model default'));
      return;
    }

    modelName = defaultModel;
  }

  // check
  const models = await exports.getModels(db);
  const model = models.find((m) => m.modelName === modelName);
  if (!model) {
    console.log(cli.colors.red(`Model not found: ${modelName}`));
    return;
  }

  // r
  return model;
};
