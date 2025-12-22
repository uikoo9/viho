// os
const os = require('os');

// path
const path = require('path');

// qiao
const cli = require('qiao-cli');

// db
const DB = require('qiao-config');

// llm
const { OpenAIAPI, GeminiAPI, GeminiVertex } = require('viho-llm');

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

/**
 * initLLM
 * @param {*} model
 * @returns
 */
exports.initLLM = (model) => {
  const modelType = model.modelType || 'openai';

  if (modelType === 'openai') {
    return OpenAIAPI({
      apiKey: model.apiKey,
      baseURL: model.baseURL,
    });
  } else if (modelType === 'gemini api') {
    return GeminiAPI({
      apiKey: model.apiKey,
      modelName: model.modelName,
    });
  } else if (modelType === 'gemini vertex') {
    return GeminiVertex({
      projectId: model.projectId,
      location: model.location,
      modelName: model.modelName,
    });
  }

  // fallback to openai
  console.log(cli.colors.yellow(`Unknown model type: ${modelType}, falling back to OpenAI`));
  return OpenAIAPI({
    apiKey: model.apiKey,
    baseURL: model.baseURL,
  });
};
