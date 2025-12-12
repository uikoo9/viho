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
  .command('chat [modelName]')
  .description('Start a continuous chat session with an AI model')
  .action(async (modelName) => {
    // model
    const model = await getModelByName(db, modelName);
    if (!model) return;

    // init
    const llm = LLM({
      apiKey: model.apiKey,
      baseURL: model.baseURL,
    });

    // logo
    printLogo();
    console.log(cli.colors.cyan(`Welcome to viho chat! Using model: ${model.modelName}`));
    console.log(cli.colors.gray('Press Ctrl+C to exit\n'));

    // chat
    let keepChatting = true;
    while (keepChatting) {
      await ask(llm, model);
    }
  });
