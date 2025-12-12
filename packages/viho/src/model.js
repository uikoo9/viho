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
