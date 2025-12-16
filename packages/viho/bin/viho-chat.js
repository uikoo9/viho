// qiao
const cli = require('qiao-cli');

// llm
const LLM = require('qiao-llm');

// util
const { ask } = require('../src/llm.js');
const { getDB, preLLMAsk } = require('../src/util.js');
const db = getDB();

// cmd
cli.cmd
  .command('chat [modelName]')
  .description('Start a continuous chat session with an AI model')
  .action(async (modelName) => {
    // pre ask
    const model = await preLLMAsk('chat', db, modelName);

    // init
    const llm = LLM({
      apiKey: model.apiKey,
      baseURL: model.baseURL,
    });

    // chat
    let keepChatting = true;
    while (keepChatting) {
      await ask(llm, model);
    }
  });
