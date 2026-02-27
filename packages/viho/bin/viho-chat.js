// qiao
const cli = require('qiao-cli');

// util
const { ask } = require('../src/llm.js');
const { getDB, printLogo, preLLMAsk, initLLM } = require('../src/util.js');
const db = getDB();

// cmd
cli.cmd
  .command('chat [modelName]')
  .description('Start a continuous chat session with an AI model')
  .action(async (modelName) => {
    // logo
    printLogo();

    // pre ask
    const model = await preLLMAsk('chat', db, modelName);
    if (!model) return;

    // init
    const llm = initLLM(model);

    // chat
    let keepChatting = true;
    while (keepChatting) {
      await ask(llm, model);
    }
  });
