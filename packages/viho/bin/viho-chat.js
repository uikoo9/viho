// qiao
const cli = require('qiao-cli');

// llm
const LLM = require('qiao-llm');

// db
const { getDB } = require('./util.js');
const db = getDB();

// util
const { ask } = require('./util.js');

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

    // chat
    let keepChatting = true;
    while (keepChatting) {
      await ask(llm, model);
    }
  });
