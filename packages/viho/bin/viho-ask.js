// qiao
const cli = require('qiao-cli');

// llm
const { OpenAIAPI } = require('viho-llm');

// util
const { ask } = require('../src/llm.js');
const { getDB, preLLMAsk } = require('../src/util.js');
const db = getDB();

// cmd
cli.cmd
  .command('ask [modelName]')
  .description('Ask a question to an AI model')
  .action(async (modelName) => {
    // pre ask
    const model = await preLLMAsk('ask', db, modelName);

    // llm
    const llm = OpenAIAPI({
      apiKey: model.apiKey,
      baseURL: model.baseURL,
    });

    // ask
    await ask(llm, model);
  });
