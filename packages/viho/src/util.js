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

// platforms
const { getOpenAIPlatforms } = require('./platforms.js');

// offical models
const { getOfficalModels } = require('./offical-models.js');

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
 * initViho
 */
exports.initViho = async () => {
  const db = exports.getDB();
  const localJson = await db.all();
  if (localJson && localJson.models && localJson.models.length) return;

  // set offical models
  const officalModels = getOfficalModels();
  await db.config('models', officalModels);
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

  // check offical model
  if (model.offical) {
    const n1nToken = await db.config('n1nToken');
    if (!n1nToken) {
      console.log(cli.colors.red('Official models require authentication. Please login using: viho login'));
      return;
    }

    model.apiKey = n1nToken;
  }

  // log
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
  const platform = model.platform || 'openai';
  const openAIPlatforms = getOpenAIPlatforms();

  if (openAIPlatforms.includes(platform)) {
    return OpenAIAPI({
      apiKey: model.apiKey,
      baseURL: model.baseURL,
    });
  } else if (platform === 'gemini api') {
    return GeminiAPI({
      apiKey: model.apiKey,
      modelName: model.modelID, // Use modelID for API calls
    });
  } else if (platform === 'gemini vertex') {
    return GeminiVertex({
      projectId: model.projectId,
      location: model.location,
      modelName: model.modelID, // Use modelID for API calls
    });
  }

  // fallback to openai
  console.log(cli.colors.yellow(`Unknown platform: ${platform}, falling back to OpenAI`));
  return OpenAIAPI({
    apiKey: model.apiKey,
    baseURL: model.baseURL,
  });
};
