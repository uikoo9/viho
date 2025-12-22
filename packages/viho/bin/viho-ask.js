// qiao
const cli = require('qiao-cli');

// util
const { ask } = require('../src/llm.js');
const { getDB, preLLMAsk, initLLM } = require('../src/util.js');
const db = getDB();

// cmd
cli.cmd
  .command('ask [modelName]')
  .description('Ask a question to an AI model')
  .action(async (modelName) => {
    // pre ask
    const model = await preLLMAsk('ask', db, modelName);

    // llm
    const llm = initLLM(model);

    // ask
    await ask(llm, model);
  });
