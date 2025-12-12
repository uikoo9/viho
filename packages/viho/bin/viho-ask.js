// qiao
const cli = require('qiao-cli');

// llm
const LLM = require('qiao-llm');

// util
const { ask } = require('../src/llm.js');
const { getModelByName } = require('../src/model.js');
const { getDB, printLogo } = require('../src/util.js');
const db = getDB();

// cmd
cli.cmd
  .command('ask [modelName]')
  .description('Ask a question to an AI model')
  .action(async (modelName) => {
    // model
    const model = await getModelByName(db, modelName);
    if (!model) return;

    // llm
    const llm = LLM({
      apiKey: model.apiKey,
      baseURL: model.baseURL,
    });

    // logo
    printLogo();

    // ask
    await ask(llm, model);
  });
