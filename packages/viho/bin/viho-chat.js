// qiao
const cli = require('qiao-cli');

// llm
const LLM = require('qiao-llm');

// util
const { getDB, ask, printLogo } = require('./util.js');
const db = getDB();

// cmd
cli.cmd
  .command('chat [modelName]')
  .description('Start a continuous chat session with an AI model')
  .action(async (modelName) => {
    if (!modelName) {
      const defaultModel = await db.config('default');
      if (!defaultModel) {
        console.log(cli.colors.red('No default model set. Use: viho model default'));
        return;
      }

      modelName = defaultModel;
    }

    // check
    const model = await db.config(modelName);
    if (!model) {
      console.log(cli.colors.red(`Model not found: ${modelName}`));
      return;
    }

    // init
    const llm = LLM({
      apiKey: model.apiKey,
      baseURL: model.baseURL,
    });

    // logo
    printLogo();
    console.log(cli.colors.cyan(`Welcome to viho chat! Using model: ${modelName}`));
    console.log(cli.colors.gray('Press Ctrl+C to exit\n'));

    // chat
    let keepChatting = true;
    while (keepChatting) {
      await ask(llm, model);
    }
  });
