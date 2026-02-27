// qiao
const cli = require('qiao-cli');

// util
const { ask } = require('../src/llm.js');
const { getDB, printLogo, preLLMAsk, initLLM } = require('../src/util.js');
const db = getDB();

// cmd
cli.cmd
  .command('ask [modelName]')
  .description('Ask a question to an AI model')
  .action(async (modelName) => {
    // logo
    printLogo();

    // pre ask
    const model = await preLLMAsk('ask', db, modelName);
    if (!model) return;

    // llm
    const llm = initLLM(model);

    // ask
    await ask(llm, model);
  });
